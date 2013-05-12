/**
 * The model for a game.
 */

goog.provide('low.model.Game');

goog.require('goog.array');
goog.require('low.model.Player');



/**
 * @param {string} key
 * @param {!Array.<!low.model.Player>} players
 * @constructor
 */
low.model.Game = function(key, players) {

  /** @private {string} */
  this.key_ = key;

  /** @private {!Array.<!low.model.Player>} */
  this.players_ = players;
};


/**
 * @return {string}
 */
low.model.Game.prototype.getKey = function() {
  return this.key_;
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

  var key = json['key'];

  var players = [];
  var playersJson = json['players'];
  goog.array.forEach(playersJson, function(playerJson) {
    players.push(low.model.Player.fromJson(playerJson));
  });

  return new low.model.Game(key, players);
};
