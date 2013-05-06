/**
 * The home page component.  This is where players can find and create games.
 */

goog.provide('low.ui.home.Home');

goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component');
goog.require('low');
goog.require('low.controller.Page');
goog.require('low.ui');
goog.require('low.ui.Page');
goog.require('low.ui.home.GamesContainer');
goog.require('low.ui.home.soy');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.home.Home = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.home.Home');

  /** @private {!low.controller.Page} */
  this.pageController_ = low.controller.Page.getInstance();

  /** @private {!low.ui.home.GamesContainer} */
  this.gamesContainer_ = new low.ui.home.GamesContainer();
  this.addChild(this.gamesContainer_);

  /** @private {!goog.ui.Button} */
  this.createGameButton_ = new goog.ui.Button(null);
  this.addChild(this.createGameButton_);
};
goog.inherits(low.ui.home.Home, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
low.ui.home.Home.Id_ = {
  CREATE_GAME_BUTTON: low.getUniqueId('create-game-button'),
  GAMES_CONTAINER: low.getUniqueId('games-container')
};


/** @override */
low.ui.home.Home.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      low.ui.home.soy.HOME, {
        ids: this.makeIds(low.ui.home.Home.Id_)
      }));

  this.gamesContainer_.render(low.ui.getElementByFragment(
      this, low.ui.home.Home.Id_.GAMES_CONTAINER));
  this.createGameButton_.decorate(low.ui.getElementByFragment(
      this, low.ui.home.Home.Id_.CREATE_GAME_BUTTON));
};


/** @override */
low.ui.home.Home.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.createGameButton_,
      goog.ui.Component.EventType.ACTION,
      this.createNewGame_);
};


/**
 * Creates a new game.
 * @private
 */
low.ui.home.Home.prototype.createNewGame_ = function() {
  goog.log.info(this.logger, 'Creating a new game.');

  // TODO Actually start creating a game.

  this.pageController_.setCurrentPage(low.ui.Page.WAITING_ROOM);
};
