/**
 * The container for games to join.
 */

goog.provide('low.ui.home.GamesContainer');

goog.require('goog.array');
goog.require('goog.log');
goog.require('goog.ui.Component');
goog.require('low.service.Games');
goog.require('low.ui.home.Game');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.home.GamesContainer = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.home.GamesContainer');

  /** @private {!low.service.Games} */
  this.gamesService_ = low.service.Games.getInstance();
};
goog.inherits(low.ui.home.GamesContainer, goog.ui.Component);


/** @override */
low.ui.home.GamesContainer.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.gamesService_.loadGames().addCallback(
      goog.bind(this.renderGames_, this));
};


/**
 * Renders the currently active games.
 * @private
 */
low.ui.home.GamesContainer.prototype.renderGames_ = function() {
  goog.log.info(this.logger, 'Rendering games.');

  // Clear existing games.
  goog.disposeAll(this.removeChildren(true));

  var games = this.gamesService_.getGames();
  goog.array.forEach(games, function(game) {
    var gameComponent = new low.ui.home.Game(game);
    this.addChild(gameComponent, true);
  }, this);
};
