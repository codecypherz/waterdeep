
goog.provide('low.message.JoinGameResponse');

goog.require('goog.asserts');
goog.require('low');
goog.require('low.message.Message');
goog.require('low.message.Type');
goog.require('low.model.Game');



/**
 * @param {!low.message.JoinGameResponse.Result} result
 * @param {low.model.Game} game
 * @constructor
 * @extends {low.message.Message}
 */
low.message.JoinGameResponse = function(result, game) {
  goog.base(this, low.message.Type.JOIN_GAME_RESPONSE);

  /** @private {!low.message.JoinGameResponse.Result} */
  this.result_ = result;

  /** @private {low.model.Game} */
  this.game_ = game;
};
goog.inherits(low.message.JoinGameResponse, low.message.Message);


/**
 * The result of the join game request.
 * @enum {string}
 */
low.message.JoinGameResponse.Result = {
  ALREADY_JOINED: 'already_joined',
  COLOR_TAKEN: 'color_taken',
  GAME_FULL: 'game_full',
  NOT_FOUND: 'not_found',
  SUCCESS: 'success'
};


/**
 * @return {!low.message.JoinGameResponse.Result}
 */
low.message.JoinGameResponse.prototype.getResult = function() {
  return this.result_;
};


/**
 * @return {low.model.Game} The game, if the join was successful.
 */
low.message.JoinGameResponse.prototype.getGame = function() {
  return this.game_;
};


/** @override */
low.message.JoinGameResponse.prototype.toJson = function() {
  var json = goog.base(this, 'toJson');
  json['result'] = this.result_;
  return json;
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

  var game = json['game'] ? low.model.Game.fromJson(json['game']) : null;
  return new low.message.JoinGameResponse(result, game);
};
