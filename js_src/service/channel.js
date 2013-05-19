
goog.provide('low.service.Channel');

goog.require('goog.Uri');
goog.require('goog.json');
goog.require('goog.log');
goog.require('low.Config');
goog.require('low.message.CreateChannelResponse');
goog.require('low.service.Xhr');



/**
 * Service for creating the bidirectional channel.
 * @constructor
 */
low.service.Channel = function() {

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.service.Channel');

  /** @private {!low.service.Xhr} */
  this.xhrService_ = low.service.Xhr.getInstance();

  /**
   * Used for receiving messages from the server.
   * @private {appengine.Channel}
   */
  this.channel_ = null;

  /** @private {appengine.Socket} */
  this.socket_ = null;
};
goog.addSingletonGetter(low.service.Channel);


/**
 * Creates a new channel to the server if one didn't exist.
 * @return {!goog.async.Deferred}
 */
low.service.Channel.prototype.init = function() {

  // TODO Return a deferred that has fired if the channel exists.

  goog.log.info(this.logger, 'Creating a new channel.');

  // Create the request URL.
  var uri = new goog.Uri();
  uri.setPath(low.Config.ServletPath.CHANNELS);

  // Send the request.
  var deferred = this.xhrService_.post(uri, undefined, true);

  // Handle the response.
  deferred.addCallback(function(json) {
    var response = low.message.CreateChannelResponse.fromJson(json);
    var token = response.getToken();

    /** @suppress {missingRequire} */
    this.channel_ = new appengine.Channel(token);

    this.socket_ = this.channel_.open({
      'onopen': goog.bind(this.onOpen_, this),
      'onmessage': goog.bind(this.onMessage_, this),
      'onerror': goog.bind(this.onError_, this),
      'onclose': goog.bind(this.onClose_, this)
    });

    goog.log.info(this.logger, 'Channel created with this token: ' + token);
  }, this);

  return deferred;
};


/**
 * Called when the channel opens.
 * @private
 */
low.service.Channel.prototype.onOpen_ = function() {
  goog.log.info(this.logger, 'Channel is now open.');
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
  // TODO Turn this down to fine.
  goog.log.info(this.logger, 'Received this raw data: ' + rawData);

  // Try to parse the data as JSON.
  var json = null;

  try {

    // Parse the JSON object and make sure it succeeded.
    json = goog.json.parse(rawData);
    if (!json) {
      throw Error('Parsing resulted in a null object');
    }

    // TODO Get the type for deserialization.

  } catch (e) {
    this.logger.severe('Failed to parse the message into JSON.', e);
    return;
  }

  // TODO Handle the message.
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
