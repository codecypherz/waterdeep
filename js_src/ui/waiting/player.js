
goog.provide('low.ui.waiting.Player');

goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('low');
goog.require('low.model.Player');
goog.require('low.service.Game');
goog.require('low.ui');
goog.require('low.ui.waiting.StartGameButton');
goog.require('low.ui.waiting.soy');



/**
 * The widget representing a player in the waiting room.
 * @param {!low.model.Player} player
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.waiting.Player = function(player) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.waiting.Player');

  /** @private {!low.model.Player} */
  this.player_ = player;

  // Get a reference to self.
  var gameService = low.service.Game.getInstance();
  var game = gameService.getCurrentGame();

  /** @private {goog.ui.Button} */
  this.actionButton_ = null;
  if (game.getSelf().isModerator()) {
    if (this.player_.isModerator()) {
      this.actionButton_ = new low.ui.waiting.StartGameButton();
      this.addChild(this.actionButton_);
    }
    // TODO Else create the kick button.
  }
};
goog.inherits(low.ui.waiting.Player, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
low.ui.waiting.Player.Id_ = {
  BUTTON_CONTAINER: low.getUniqueId('button-container')
};


/** @private {!Object} */
low.ui.waiting.Player.COLOR_TO_CSS_MAP_ = goog.object.create(
    low.model.Player.Color.BLACK, goog.getCssName('holder-black-75'),
    low.model.Player.Color.BLUE, goog.getCssName('holder-blue-75'),
    low.model.Player.Color.GREEN, goog.getCssName('holder-green-75'),
    low.model.Player.Color.RED, goog.getCssName('holder-red-75'),
    low.model.Player.Color.YELLOW, goog.getCssName('holder-yellow-75')
    );


/** @override */
low.ui.waiting.Player.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      low.ui.waiting.soy.PLAYER, {
        ids: this.makeIds(low.ui.waiting.Player.Id_),
        name: this.player_.getName(),
        isModerator: this.player_.isModerator(),
        iconClass: low.ui.waiting.Player.COLOR_TO_CSS_MAP_[
            this.player_.getColor()]
      }));

  if (goog.isDefAndNotNull(this.actionButton_)) {
    this.actionButton_.render(low.ui.getElementByFragment(
        this, low.ui.waiting.Player.Id_.BUTTON_CONTAINER));
  }
};
