
goog.provide('low.message.CreateChannelResponse');

goog.require('goog.asserts');
goog.require('low.message.Message');
goog.require('low.message.Type');



/**
 * @param {string} token
 * @constructor
 * @extends {low.message.Message}
 */
low.message.CreateChannelResponse = function(token) {
  goog.base(this, low.message.Type.CREATE_CHANNEL_RESPONSE);

  /** @private {string} */
  this.token_ = token;
};
goog.inherits(low.message.CreateChannelResponse, low.message.Message);


/**
 * @return {string}
 */
low.message.CreateChannelResponse.prototype.getToken = function() {
  return this.token_;
};


/**
 * @param {!Object} json
 * @return {!low.message.CreateChannelResponse}
 */
low.message.CreateChannelResponse.fromJson = function(json) {
  var token = goog.asserts.assert(json['token'] || '');
  return new low.message.CreateChannelResponse(token);
};
