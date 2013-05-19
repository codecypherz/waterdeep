
goog.provide('low.handler.PlayerJoined');

goog.require('goog.Disposable');
goog.require('goog.asserts');
goog.require('goog.events.EventHandler');
goog.require('goog.log');
goog.require('low.message.Type');
goog.require('low.service.Channel');
goog.require('low.service.Game');



/**
 * Handles the player joined message.
 * @constructor
 * @extends {goog.Disposable}
 */
low.handler.PlayerJoined = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.service.Game');

  /** @private {!low.service.Game} */
  this.gameService_ = low.service.Game.getInstance();

  /** @private {!low.service.Channel} */
  this.channelService_ = low.service.Channel.getInstance();

  var handler = new goog.events.EventHandler(this);
  this.registerDisposable(handler);

  handler.listen(this.channelService_,
      low.message.Type.PLAYER_JOINED,
      this.onPlayerJoined_);
};
goog.inherits(low.handler.PlayerJoined, goog.Disposable);


/**
 * Adds the player to this client's game object.
 * @param {!low.service.Channel.MessageEvent} e
 * @private
 */
low.handler.PlayerJoined.prototype.onPlayerJoined_ = function(e) {
  var message = /** @type {!low.message.PlayerJoined} */ (e.message);
  goog.log.info(this.logger, 'Received player joined message.');
  var game = this.gameService_.getCurrentGame();
  game = goog.asserts.assert(game, 'Notified of player join with no game.');
  game.addPlayer(message.getPlayer());
};
