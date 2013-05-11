/**
 * The home page component.  This is where players can find and create games.
 */

goog.provide('low.ui.home.Home');

goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('low');
goog.require('low.ui');
goog.require('low.ui.home.GameCreateButton');
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

  /** @private {!low.ui.home.GamesContainer} */
  this.gamesContainer_ = new low.ui.home.GamesContainer();
  this.addChild(this.gamesContainer_);

  /** @private {!low.ui.home.GameCreateButton} */
  this.gameCreateButton_ = new low.ui.home.GameCreateButton();
  this.addChild(this.gameCreateButton_);
};
goog.inherits(low.ui.home.Home, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
low.ui.home.Home.Id_ = {
  GAME_CREATE_BUTTON: low.getUniqueId('game-create-button'),
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
  this.gameCreateButton_.decorate(low.ui.getElementByFragment(
      this, low.ui.home.Home.Id_.GAME_CREATE_BUTTON));
};
