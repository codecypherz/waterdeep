
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
 * @return {!low.message.PlayerJoined.Result}
 */
low.message.PlayerJoined.prototype.getResult = function() {
  return this.result_;
};


/**
 * @return {low.model.Game} The game, if the join was successful.
 */
low.message.PlayerJoined.prototype.getGame = function() {
  return this.game_;
};


/** @override */
low.message.PlayerJoined.prototype.toJson = function() {
  return {
    'result': this.result_
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
