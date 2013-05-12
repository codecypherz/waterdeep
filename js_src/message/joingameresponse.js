
goog.provide('low.message.JoinGameResponse');

goog.require('goog.asserts');
goog.require('low');
goog.require('low.message.Message');



/**
 * @param {!low.message.JoinGameResponse.Result} result
 * @constructor
 * @implements {low.message.Message}
 */
low.message.JoinGameResponse = function(result) {

  /** @private {!low.message.JoinGameResponse.Result} */
  this.result_ = result;
};


/**
 * The result of the join game request.
 * @enum {string}
 */
low.message.JoinGameResponse.Result = {
  COLOR_TAKEN: 'color_taken',
  SUCCESS: 'success'
};


/**
 * @return {!low.message.JoinGameResponse.Result}
 */
low.message.JoinGameResponse.prototype.getResult = function() {
  return this.result_;
};


/** @override */
low.message.JoinGameResponse.prototype.toJson = function() {
  return {
    'result': this.result_
  };
};


/**
 * @param {!Object} json
 * @return {!low.message.JoinGameResponse}
 */
low.message.JoinGameResponse.fromJson = function(json) {
  var result = /** @type {low.message.JoinGameResponse.Result} */ (
      low.stringToEnum(
          json['result'] || '',
          low.message.JoinGameResponse.Result));
  result = goog.asserts.assert(result);
  return new low.message.JoinGameResponse(result);
};
