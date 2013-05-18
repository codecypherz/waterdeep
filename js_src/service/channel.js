
goog.provide('low.service.Channel');

goog.require('goog.Uri');
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
    goog.log.info(this.logger, 'Channel created with this token: ' + token);
  }, this);

  return deferred;
};
