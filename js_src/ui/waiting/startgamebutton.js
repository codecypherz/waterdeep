
goog.provide('low.ui.waiting.StartGameButton');

goog.require('goog.asserts');
goog.require('goog.dom.classes');
goog.require('goog.log');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component');
goog.require('low.model.Game');
goog.require('low.service.Game');
goog.require('low.ui.Css');



/**
 * The button that lets the moderator start the game.
 * @constructor
 * @extends {goog.ui.Button}
 */
low.ui.waiting.StartGameButton = function() {
  goog.base(this, 'Start Game');

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.waiting.StartGameButton');

  /** @private {!low.service.Game} */
  this.gameService_ = low.service.Game.getInstance();

  /** @private {!low.model.Game} */
  this.game_ = goog.asserts.assert(
      this.gameService_.getCurrentGame(),
      'Cannot create start game button without an active game.');
};
goog.inherits(low.ui.waiting.StartGameButton, goog.ui.Button);


/** @override */
low.ui.waiting.StartGameButton.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classes.add(this.getElement(), low.ui.Css.CALL_TO_ACTION);
};


/** @override */
low.ui.waiting.StartGameButton.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this,
      goog.ui.Component.EventType.ACTION,
      this.startGame_);

  this.getHandler().listen(this.game_,
      [low.model.Game.EventType.PLAYER_JOINED,
       low.model.Game.EventType.PLAYER_LEFT],
      this.update_);

  this.update_();
};


/**
 * Updates the state of the button based on how many players there are.
 * @private
 */
low.ui.waiting.StartGameButton.prototype.update_ = function() {
  this.setEnabled(this.game_.getPlayers().length > 1);
};


/**
 * Starts the current game.
 * @private
 */
low.ui.waiting.StartGameButton.prototype.startGame_ = function() {
  this.gameService_.startCurrentGame();
};
