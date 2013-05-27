
goog.provide('low.message.StartGameNotification');

goog.require('low.message.Message');
goog.require('low.message.Type');
goog.require('low.model.Game');



/**
 * @param {!low.model.Game} game
 * @constructor
 * @extends {low.message.Message}
 */
low.message.StartGameNotification = function(game) {
  goog.base(this, low.message.Type.START_GAME_NOTIFICATION);

  /** @private {!low.model.Game} */
  this.game_ = game;
};
goog.inherits(low.message.StartGameNotification, low.message.Message);


/**
 * @return {!low.model.Game}
 */
low.message.StartGameNotification.prototype.getGame = function() {
  return this.game_;
};


/**
 * @param {!Object} json
 * @return {!low.message.StartGameNotification}
 */
low.message.StartGameNotification.fromJson = function(json) {
  var game = low.model.Game.fromJson(json['game']);
  return new low.message.StartGameNotification(game);
};
