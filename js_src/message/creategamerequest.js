/**
 * The message requests creating a new game.
 */

goog.provide('low.message.CreateGameRequest');

goog.require('low.message.Message');



/**
 * @param {string} moderatorName The name of the moderator creating the game.
 * @param {!low.model.Player.Color} color The player color.
 * @constructor
 * @implements {low.message.Message}
 */
low.message.CreateGameRequest = function(moderatorName, color) {

  /** @private {string} */
  this.moderatorName_ = moderatorName;

  /** @private {!low.model.Player.Color} */
  this.color_ = color;
};


/** @override */
low.message.CreateGameRequest.prototype.toJson = function() {
  return {
    'color': this.color_,
    'moderatorName': this.moderatorName_
  };
};
