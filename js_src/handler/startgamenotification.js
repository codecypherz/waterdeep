
goog.provide('low.handler.StartGameNotification');

goog.require('goog.Disposable');
goog.require('goog.events.EventHandler');
goog.require('goog.log');
goog.require('low.message.Type');
goog.require('low.model.Page');
goog.require('low.service.Channel');
goog.require('low.service.Game');
goog.require('low.service.Token');



/**
 * Handles the start game notification.
 * @constructor
 * @extends {goog.Disposable}
 */
low.handler.StartGameNotification = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.handler.StartGameNotification');

  /** @private {!low.service.Game} */
  this.gameService_ = low.service.Game.getInstance();

  /** @private {!low.service.Token} */
  this.tokenService_ = low.service.Token.getInstance();

  var handler = new goog.events.EventHandler(this);
  this.registerDisposable(handler);

  handler.listen(low.service.Channel.getInstance(),
      low.message.Type.START_GAME_NOTIFICATION,
      this.onStartGameNotification_);
};
goog.inherits(low.handler.StartGameNotification, goog.Disposable);


/**
 * Starts the game on this client.
 * @param {!low.service.Channel.MessageEvent} e
 * @private
 */
low.handler.StartGameNotification.prototype.onStartGameNotification_ =
    function(e) {
  var message = /** @type {!low.message.StartGameNotification} */ (e.message);
  goog.log.info(this.logger, 'Received the start game notification.');

  // Update with the latest game data.
  this.gameService_.updateCurrentGame(message.getGame());

  // Flip the UI into the in-game state.
  var currentGame = this.gameService_.getCurrentGame();
  this.tokenService_.setCurrentToken(
      low.model.Page.GAME, currentGame.getKey());
};
