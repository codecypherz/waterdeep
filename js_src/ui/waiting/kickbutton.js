
goog.provide('low.ui.waiting.KickButton');

goog.require('goog.log');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component');



/**
 * The button that lets the moderator kick the given player.
 * @param {!low.model.Player} player
 * @constructor
 * @extends {goog.ui.Button}
 */
low.ui.waiting.KickButton = function(player) {
  goog.base(this, 'Kick');

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.waiting.KickButton');

  /** @private {!low.model.Player} */
  this.player_ = player;
};
goog.inherits(low.ui.waiting.KickButton, goog.ui.Button);


/** @override */
low.ui.waiting.KickButton.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this,
      goog.ui.Component.EventType.ACTION,
      this.kick_);
};


/**
 * Kicks the player from the game.
 * @private
 */
low.ui.waiting.KickButton.prototype.kick_ = function() {
  goog.log.info(this.logger,
      'Showing confirm kick for ' + this.player_.getName());
  // TODO Create a player service and actually implement kick.
};
