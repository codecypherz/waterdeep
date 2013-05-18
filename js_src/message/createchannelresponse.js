
goog.provide('low.message.CreateChannelResponse');

goog.require('goog.asserts');
goog.require('low.message.Message');



/**
 * @param {string} token
 * @constructor
 * @implements {low.message.Message}
 */
low.message.CreateChannelResponse = function(token) {

  /** @private {string} */
  this.token_ = token;
};


/**
 * @return {string}
 */
low.message.CreateChannelResponse.prototype.getToken = function() {
  return this.token_;
};


/** @override */
low.message.CreateChannelResponse.prototype.toJson = function() {
  return {
    'token': this.token_
  };
};


/**
 * @param {!Object} json
 * @return {!low.message.CreateChannelResponse}
 */
low.message.CreateChannelResponse.fromJson = function(json) {
  var token = goog.asserts.assert(json['token'] || '');
  return new low.message.CreateChannelResponse(token);
};
