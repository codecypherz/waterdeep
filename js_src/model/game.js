/**
 * The model for a game.
 */

goog.provide('low.model.Game');

goog.require('goog.array');
goog.require('low.model.Player');



/**
 * @constructor
 */
low.model.Game = function() {

  /** @private {!Array.<!low.model.Player>} */
  this.players_ = [];
};


/**
 * @return {!Array.<!low.model.Player>}
 */
low.model.Game.prototype.getPlayers = function() {
  return this.players_;
};


/**
 * @param {!Object} json The JSON for a game object.
 * @return {!low.model.Game} The parsed game model.
 */
low.model.Game.fromJson = function(json) {
  var game = new low.model.Game();

  var playersJson = json['players'];
  goog.array.forEach(playersJson, function(playerJson) {
    game.players_.push(low.model.Player.fromJson(playerJson));
  });

  return game;
};
