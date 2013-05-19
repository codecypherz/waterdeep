/**
 * The model for a game.
 */

goog.provide('low.model.Game');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.events.EventTarget');
goog.require('low');
goog.require('low.model.Player');



/**
 * @param {string} key
 * @param {!Array.<!low.model.Player>} players
 * @constructor
 * @extends {goog.events.EventTarget}
 */
low.model.Game = function(key, players) {
  goog.base(this);

  /** @private {string} */
  this.key_ = key;

  /** @private {!Array.<!low.model.Player>} */
  this.players_ = players;
};
goog.inherits(low.model.Game, goog.events.EventTarget);


/** @enum {string} */
low.model.Game.EventType = {
  PLAYER_JOINED: low.getUniqueId('player-joined')
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
 * Adds a player to the game.
 * @param {!low.model.Player} player
 */
low.model.Game.prototype.addPlayer = function(player) {
  this.players_.push(player);
  this.dispatchEvent(low.model.Game.EventType.PLAYER_JOINED);
};


/**
 * @return {!low.model.Player} The player this client represents.
 */
low.model.Game.prototype.getSelf = function() {
  var self = goog.array.find(this.players_, function(player) {
    return player.isSelf();
  });
  return goog.asserts.assert(self, 'The self player could not be found.');
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
