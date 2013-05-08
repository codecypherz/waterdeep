/**
 * The message requests creating a new game.
 */

goog.provide('low.message.CreateGameRequest');

goog.require('low.message.Message');



/**
 * @param {string} moderatorName The name of the moderator creating the game.
 * @constructor
 * @implements {low.message.Message}
 */
low.message.CreateGameRequest = function(moderatorName) {

  /** @private {string} */
  this.moderatorName_ = moderatorName;
};


/** @override */
low.message.CreateGameRequest.prototype.toJson = function() {
  return {
    'moderatorName': this.moderatorName_
  };
};
