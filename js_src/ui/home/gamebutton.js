/**
 * The component representing a single game.
 */

goog.provide('low.ui.home.GameButton');

goog.require('goog.array');
goog.require('goog.events.EventType');
goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.soy');
goog.require('goog.ui.Button');
goog.require('low.model.Player');
goog.require('low.ui.home.soy');



/**
 * @constructor
 * @param {!low.model.Game} game
 * @extends {goog.ui.Button}
 */
low.ui.home.GameButton = function(game) {
  goog.base(this, null);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.home.GameButton');

  /** @private {!low.model.Game} */
  this.game_ = game;
};
goog.inherits(low.ui.home.GameButton, goog.ui.Button);


/** @private {!Object} */
low.ui.home.GameButton.COLOR_TO_CSS_MAP_ = goog.object.create(
    low.model.Player.Color.BLACK, goog.getCssName('holder-black-22'),
    low.model.Player.Color.BLUE, goog.getCssName('holder-blue-22'),
    low.model.Player.Color.GREEN, goog.getCssName('holder-green-22'),
    low.model.Player.Color.RED, goog.getCssName('holder-red-22'),
    low.model.Player.Color.YELLOW, goog.getCssName('holder-yellow-22')
    );


/** @override */
low.ui.home.GameButton.prototype.createDom = function() {

  // Create the template data.
  var playerData = goog.array.map(
      this.game_.getPlayers(),
      function(player) {
        return {
          'name': player.getName(),
          'iconClass': low.ui.home.GameButton.COLOR_TO_CSS_MAP_[
              player.getColor()]
        };
      });

  // Render the template.
  this.setElementInternal(goog.soy.renderAsElement(
      low.ui.home.soy.GAME, {
        players: playerData
      }));
};


/** @override */
low.ui.home.GameButton.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  // Don't using goog.ui.Component.EventType.ACTION because it's fired twice
  // when you bypass the renderer paradigm with the createDom method above.
  this.getHandler().listen(this.getElement(),
      goog.events.EventType.CLICK,
      this.joinGame_);
};


/**
 * Joins the game.
 * @private
 */
low.ui.home.GameButton.prototype.joinGame_ = function() {
  goog.log.info(this.logger, 'Attempting to join the game.');

  // TODO Actually join a game.
};
