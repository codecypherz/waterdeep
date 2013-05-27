
goog.provide('low.service.Channel');

goog.require('goog.Uri');
goog.require('goog.asserts');
goog.require('goog.async.Deferred');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.json');
goog.require('goog.log');
goog.require('low');
goog.require('low.ServletPath');
goog.require('low.message.CreateChannelResponse');
goog.require('low.message.Map');
goog.require('low.message.Message');
goog.require('low.message.Type');
goog.require('low.service.Xhr');



/**
 * Service for creating the bidirectional channel.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
low.service.Channel = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.service.Channel');

  /** @private {!low.service.Xhr} */
  this.xhrService_ = low.service.Xhr.getInstance();

  /**
   * Keeps track of the open state of the channel.  The channel is not
   * considered open unless it successfully receives the connected message from
   * the server.
   * @private {boolean}
   */
  this.isOpen_ = false;

  /**
   * The callback of this deferred represents a successful channel
   * initialization which includes requesting the channel token and receiving
   * the initial connected message.
   * @private {goog.async.Deferred}
   */
  this.deferredInit_ = null;

  /**
   * The callback of this deferred represents the connected message arriving on
   * the channel which completes initialization.
   * @private {goog.async.Deferred}
   */
  this.deferredConnected_ = null;
};
goog.inherits(low.service.Channel, goog.events.EventTarget);
goog.addSingletonGetter(low.service.Channel);


/**
 * Creates a new channel to the server if one didn't exist.
 * @return {!goog.async.Deferred}
 */
low.service.Channel.prototype.init = function() {

  // If currently opening, the callback will fire once ready.
  // If open, the callback will be called immediately.
  if (this.deferredInit_) {
    return this.deferredInit_.branch();
  }

  goog.asserts.assert(!this.deferredConnected_,
      'Connected deferred should be null for the first call to init.');
  goog.log.info(this.logger, 'Creating a new channel.');

  // Send the request.
  this.deferredInit_ = this.xhrService_.post(
      new goog.Uri().setPath(low.ServletPath.CHANNELS), undefined, true);

  // Handle the response.
  this.deferredInit_.addCallbacks(
      function(json) {
        var response = low.message.CreateChannelResponse.fromJson(json);
        var token = response.getToken();

        /** @suppress {missingRequire} */
        var channel = new appengine.Channel(token);

        // This returns an {appengine.Socket}.
        channel.open({
          'onopen': goog.bind(this.onOpen_, this),
          'onmessage': goog.bind(this.onMessage_, this),
          'onerror': goog.bind(this.onError_, this),
          'onclose': goog.bind(this.onClose_, this)
        });

        goog.log.info(this.logger, 'Channel created with this token: ' + token);

        // Returning a deferred here will block the execution sequence in the
        // deferred that is returned here fires its callback/errback.
        this.deferredConnected_ = new goog.async.Deferred();
        return this.deferredConnected_;
      },
      function(e) {
        // Clear the deferred on error so new init calls can be attempted.
        goog.log.error(this.logger, 'Failed to open the channel: ' + e);
        this.deferredInit_ = null;
        this.deferredConnected_ = null;
      },
      this);

  return this.deferredInit_.branch();
};


/**
 * @return {boolean}
 */
low.service.Channel.prototype.isOpen = function() {
  return this.isOpen_;
};


/**
 * Called when the channel opens.
 * @private
 */
low.service.Channel.prototype.onOpen_ = function() {
  goog.log.info(this.logger, 'Channel onOpen_ called.');
};


/**
 * Called when a message comes from the server.
 * @param {*} channelMessage The message coming from the server.
 * @private
 */
low.service.Channel.prototype.onMessage_ = function(channelMessage) {

  // Check the raw data.
  var rawData = channelMessage.data;
  if (!rawData) {
    throw Error('Received an empy message from the server.');
  }
  goog.log.fine(this.logger, 'Received this raw data: ' + rawData);

  // Parse the JSON object and make sure it succeeded.
  var json = goog.json.parse(rawData);
  if (!json) {
    throw Error('Parsing resulted in a null object');
  }

  // Extract the type of message.
  var type = /** @type {low.message.Type} */ (
      low.stringToEnum(json['type'] || '', low.message.Type));
  type = goog.asserts.assert(type, 'No type found in the message');

  // Construct the message.
  var fromJsonFn = low.message.Map[type];
  var message;
  if (goog.isDefAndNotNull(fromJsonFn)) {
    message = fromJsonFn(json);
  } else {
    message = new low.message.Message(type);
  }

  // Finish opening the channel with the connected message.
  if (!this.isOpen_) {
    // If the channel isn't open, the first message is expected to be the
    // connected message.
    if (message.getType() == low.message.Type.CONNECTED) {
      goog.log.info(this.logger, 'Received connected message - channel open.');
      this.isOpen_ = true;
      this.deferredConnected_.callback();
    } else {
      goog.log.error(this.logger, 'First message was not connected message');
      this.deferredConnected_.errback();
      return;
    }
  }

  // Tell everyone about the newly arrived message (including connected).
  this.dispatchEvent(new low.service.Channel.MessageEvent(type, message));
};


/**
 * Called when the channel closes.
 * @private
 */
low.service.Channel.prototype.onClose_ = function() {
  goog.log.info(this.logger, 'Channel is now closed.');
};


/**
 * Called when the channel has some sort of error.
 * @param {*} e The error object.
 * @private
 */
low.service.Channel.prototype.onError_ = function(e) {
  goog.log.error(this.logger,
      'The channel had an error: ' + e.code + ', ' + e.description);
};



/**
 * Dispatched when a new message arrives on the channel.
 * @param {!low.message.Type} type The type of message just received.
 * @param {!low.message.Message} message The message just received.
 * @extends {goog.events.Event}
 * @constructor
 */
low.service.Channel.MessageEvent = function(type, message) {
  goog.base(this, type);

  /**
   * @type {!low.message.Message}
   */
  this.message = message;
};
goog.inherits(low.service.Channel.MessageEvent, goog.events.Event);
