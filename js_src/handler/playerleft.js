
goog.provide('low.handler.PlayerLeft');

goog.require('goog.Disposable');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.events.EventHandler');
goog.require('goog.log');
goog.require('low.message.Type');
goog.require('low.service.Channel');
goog.require('low.service.Game');



/**
 * Handles the player left message.
 * @constructor
 * @extends {goog.Disposable}
 */
low.handler.PlayerLeft = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.handler.PlayerLeft');

  /** @private {!low.service.Game} */
  this.gameService_ = low.service.Game.getInstance();

  /** @private {!low.service.Channel} */
  this.channelService_ = low.service.Channel.getInstance();

  var handler = new goog.events.EventHandler(this);
  this.registerDisposable(handler);

  handler.listen(this.channelService_,
      low.message.Type.PLAYER_LEFT,
      this.onPlayerLeft_);
};
goog.inherits(low.handler.PlayerLeft, goog.Disposable);


/**
 * Removes the player from the current game.
 * @param {!low.service.Channel.MessageEvent} e
 * @private
 */
low.handler.PlayerLeft.prototype.onPlayerLeft_ = function(e) {
  var message = /** @type {!low.message.PlayerLeft} */ (e.message);
  goog.log.info(this.logger, 'Received player left message.');

  var game = this.gameService_.getCurrentGame();
  game = goog.asserts.assert(game, 'Notified of player left with no game.');

  // Update the moderator in case the player that left was the moderator.
  var updatedModerator = goog.array.some(game.getPlayers(), function(player) {
    if (player.getClientId() == message.getModerator().getClientId()) {
      player.setModerator(true);
      return true;
    }
    return false;
  });
  goog.asserts.assert(updatedModerator, 'Failed to update the new moderator.');

  // Remove the player from the game.
  game.removePlayer(message.getPlayer());
};
