/**
 * The message requests creating a new game.
 */

goog.provide('low.message.CreateGameRequest');

goog.require('low.message.Message');
goog.require('low.message.Type');



/**
 * @param {string} moderatorName The name of the moderator creating the game.
 * @param {!low.model.Player.Color} color The player color.
 * @constructor
 * @extends {low.message.Message}
 */
low.message.CreateGameRequest = function(moderatorName, color) {
  goog.base(this, low.message.Type.CREATE_GAME_REQUEST);

  /** @private {string} */
  this.moderatorName_ = moderatorName;

  /** @private {!low.model.Player.Color} */
  this.color_ = color;
};
goog.inherits(low.message.CreateGameRequest, low.message.Message);


/** @override */
low.message.CreateGameRequest.prototype.toJson = function() {
  var json = goog.base(this, 'toJson');
  json['color'] = this.color_;
  json['moderatorName'] = this.moderatorName_;
  return json;
};
