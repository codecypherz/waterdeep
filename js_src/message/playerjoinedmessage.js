
goog.provide('low.message.PlayerJoined');

goog.require('low.message.Message');
goog.require('low.model.Player');



/**
 * @param {!low.model.Player} player
 * @constructor
 * @implements {low.message.Message}
 */
low.message.PlayerJoined = function(player) {

  /** @private {!low.model.Player} */
  this.player_ = player;
};


/**
 * @return {!low.model.Player} The player that joined.
 */
low.message.PlayerJoined.prototype.getPlayer = function() {
  return this.player_;
};


/** @override */
low.message.PlayerJoined.prototype.toJson = function() {
  return {
    'player': this.player_
  };
};


/**
 * @param {!Object} json
 * @return {!low.message.PlayerJoined}
 */
low.message.PlayerJoined.fromJson = function(json) {
  var player = low.model.Player.fromJson(json['player']);
  return new low.message.PlayerJoined(player);
};
