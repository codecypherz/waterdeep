
goog.provide('low.service.Channel');

goog.require('goog.Uri');
goog.require('goog.asserts');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.json');
goog.require('goog.log');
goog.require('low');
goog.require('low.ServletPath');
goog.require('low.message.CreateChannelResponse');
goog.require('low.message.Map');
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

  /** @private {goog.async.Deferred} */
  this.deferredInit_ = null;
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

  goog.log.info(this.logger, 'Creating a new channel.');

  // Create the request URL.
  var uri = new goog.Uri();
  uri.setPath(low.ServletPath.CHANNELS);

  // Send the request.
  this.deferredInit_ = this.xhrService_.post(uri, undefined, true);

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
      },
      function(e) {
        // Clear the deferred on error so new init calls can be attempted.
        goog.log.error(this.logger, 'Failed to open the channel: ' + e);
        this.deferredInit_ = null;
      },
      this);

  return this.deferredInit_.branch();
};


/**
 * Called when the channel opens.
 * @private
 */
low.service.Channel.prototype.onOpen_ = function() {
  goog.log.info(this.logger, 'Channel is now open.');
  if (!this.deferredInit_) {
    goog.log.error(this.logger, 'Notified of channel open with no deferred');
  }
  this.deferredInit_.callback();
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
  var fromJsonFn = goog.asserts.assert(
      low.message.Map[type], 'No fromJson function mapped for ' + type);
  var message = fromJsonFn(json);

  // Tell everyone about the newly arrived message.
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
