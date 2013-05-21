
goog.provide('low.message.LeaveGameRequest');

goog.require('low.message.Message');
goog.require('low.message.Type');



/**
 * Requests this client's player leave the game.
 * @constructor
 * @extends {low.message.Message}
 */
low.message.LeaveGameRequest = function() {
  goog.base(this, low.message.Type.LEAVE_GAME_REQUEST);
};
goog.inherits(low.message.LeaveGameRequest, low.message.Message);
