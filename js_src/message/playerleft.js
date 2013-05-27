
goog.provide('low.message.PlayerLeft');

goog.require('low.message.Message');
goog.require('low.message.Type');
goog.require('low.model.Player');



/**
 * @param {!low.model.Player} player
 * @param {!low.model.Player} moderator
 * @constructor
 * @extends {low.message.Message}
 */
low.message.PlayerLeft = function(player, moderator) {
  goog.base(this, low.message.Type.PLAYER_LEFT);

  /** @private {!low.model.Player} */
  this.player_ = player;

  /** @private {!low.model.Player} */
  this.moderator_ = moderator;
};
goog.inherits(low.message.PlayerLeft, low.message.Message);


/**
 * @return {!low.model.Player} The player that joined.
 */
low.message.PlayerLeft.prototype.getPlayer = function() {
  return this.player_;
};


/**
 * @return {!low.model.Player} The new moderator.
 */
low.message.PlayerLeft.prototype.getModerator = function() {
  return this.moderator_;
};


/**
 * @param {!Object} json
 * @return {!low.message.PlayerLeft}
 */
low.message.PlayerLeft.fromJson = function(json) {
  var player = low.model.Player.fromJson(json['player']);
  var moderator = low.model.Player.fromJson(json['moderator']);
  return new low.message.PlayerLeft(player, moderator);
};
