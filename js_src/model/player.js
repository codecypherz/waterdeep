/**
 * The model for a player in a game.
 */

goog.provide('low.model.Player');



/**
 * @constructor
 */
low.model.Player = function() {

  /** @private {string} */
  this.name_ = '';
};


/**
 * @return {string}
 */
low.model.Player.prototype.getName = function() {
  return this.name_;
};


/**
 * @param {!Object} json The JSON for a player object.
 * @return {!low.model.Player} The parsed player model.
 */
low.model.Player.fromJson = function(json) {
  var player = new low.model.Player();
  player.name_ = json['name'] || '';
  return player;
};
