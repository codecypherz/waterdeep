/**
 * The component representing a single game.
 */

goog.provide('low.ui.home.Game');

goog.require('goog.array');
goog.require('goog.events.EventType');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Button');
goog.require('low.ui.home.soy');



/**
 * @constructor
 * @param {!low.model.Game} game
 * @extends {goog.ui.Button}
 */
low.ui.home.Game = function(game) {
  goog.base(this, null);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.home.Game');

  /** @private {!low.model.Game} */
  this.game_ = game;
};
goog.inherits(low.ui.home.Game, goog.ui.Button);


/** @override */
low.ui.home.Game.prototype.createDom = function() {

  // Get the template data.
  var playerNames = goog.array.map(
      this.game_.getPlayers(),
      function(player) {
        return player.getName();
      });

  // Render the template.
  this.setElementInternal(goog.soy.renderAsElement(
      low.ui.home.soy.GAME, {
        playerNames: playerNames
      }));
};


/** @override */
low.ui.home.Game.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  // TODO Figure out why the goog.ui.Component.EventType.ACTION fires twice.
  this.getHandler().listen(this.getElement(),
      goog.events.EventType.CLICK,
      this.joinGame_);
};


/**
 * Joins the game.
 * @private
 */
low.ui.home.Game.prototype.joinGame_ = function(e) {
  goog.log.info(this.logger, 'Attempting to join the game.');

  // TODO Actually join a game.
};
