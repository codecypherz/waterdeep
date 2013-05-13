/**
 * The waiting page component.  This is where players wait to find other players
 * before starting a game.
 */

goog.provide('low.ui.waiting.WaitingRoom');

goog.require('goog.events.EventType');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('low');
goog.require('low.controller.Page');
goog.require('low.ui.Page');
goog.require('low.ui.waiting.soy');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.waiting.WaitingRoom = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.waiting.WaitingRoom');

  /** @private {!low.controller.Page} */
  this.pageController_ = low.controller.Page.getInstance();
};
goog.inherits(low.ui.waiting.WaitingRoom, goog.ui.Component);


/**
 * @enum {string}
 * @private
 */
low.ui.waiting.WaitingRoom.Id_ = {
  LEAVE_BUTTON: low.getUniqueId('leave-button')
};


/** @override */
low.ui.waiting.WaitingRoom.prototype.createDom = function() {
  this.setElementInternal(goog.soy.renderAsElement(
      low.ui.waiting.soy.WAITING_ROOM, {
        ids: this.makeIds(low.ui.waiting.WaitingRoom.Id_)
      }));
};


/** @override */
low.ui.waiting.WaitingRoom.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(
      this.getElementByFragment(
          low.ui.waiting.WaitingRoom.Id_.LEAVE_BUTTON),
      goog.events.EventType.CLICK,
      this.leave_);
};


/**
 * Leaves the waiting room.
 * @private
 */
low.ui.waiting.WaitingRoom.prototype.leave_ = function() {
  goog.log.info(this.logger, 'Leaving the waiting room.');

  this.pageController_.setCurrentToken(low.ui.Page.HOME);
};
