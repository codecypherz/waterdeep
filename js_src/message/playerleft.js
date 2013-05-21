
goog.provide('low.message.PlayerLeft');

goog.require('low.message.Message');
goog.require('low.message.Type');
goog.require('low.model.Player');



/**
 * @param {!low.model.Player} player
 * @constructor
 * @extends {low.message.Message}
 */
low.message.PlayerLeft = function(player) {
  goog.base(this, low.message.Type.PLAYER_LEFT);

  /** @private {!low.model.Player} */
  this.player_ = player;
};
goog.inherits(low.message.PlayerLeft, low.message.Message);


/**
 * @return {!low.model.Player} The player that joined.
 */
low.message.PlayerLeft.prototype.getPlayer = function() {
  return this.player_;
};


/** @override */
low.message.PlayerLeft.prototype.toJson = function() {
  var json = goog.base(this, 'toJson');
  json['player'] = this.player_;
  return json;
};


/**
 * @param {!Object} json
 * @return {!low.message.PlayerLeft}
 */
low.message.PlayerLeft.fromJson = function(json) {
  var player = low.model.Player.fromJson(json['player']);
  return new low.message.PlayerLeft(player);
};
