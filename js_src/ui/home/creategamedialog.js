/**
 * The prompt to create a new game.
 */

goog.provide('low.ui.home.CreateGameDialog');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.ui.Dialog');
goog.require('low');
goog.require('low.controller.Page');
goog.require('low.ui.Css');
goog.require('low.ui.Page');
goog.require('low.ui.home.soy');



/**
 * @constructor
 * @extends {goog.ui.Dialog}
 */
low.ui.home.CreateGameDialog = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.home.CreateGameDialog');

  /** @private {!low.controller.Page} */
  this.pageController_ = low.controller.Page.getInstance();

  this.setTitle('Create game');
  this.setDisposeOnHide(true);

  var buttonSet = new goog.ui.Dialog.ButtonSet()
      .addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, false, true)
      .addButton({
        key: low.ui.home.CreateGameDialog.Id_.CREATE_BUTTON,
        caption: 'Create'
      }, true);
  this.setButtonSet(buttonSet);
};
goog.inherits(low.ui.home.CreateGameDialog, goog.ui.Dialog);


/**
 * @enum {string}
 * @private
 */
low.ui.home.CreateGameDialog.Id_ = {
  CREATE_BUTTON: low.getUniqueId('create-button'),
  NAME_INPUT: low.getUniqueId('name-input')
};


/** @override */
low.ui.home.CreateGameDialog.prototype.createDom = function() {
  goog.base(this, 'createDom');

  // Don't use setContent because that requires a string.  It doesn't make sense
  // to render the template as a string just to accommodate a limitation in the
  // dialog class.
  this.getContentElement().appendChild(goog.soy.renderAsElement(
      low.ui.home.soy.CREATE_GAME_CONTENT, {
        ids: this.makeIds(low.ui.home.CreateGameDialog.Id_)
      }));

  var createButton = this.getButtonSet().getButton(
      low.ui.home.CreateGameDialog.Id_.CREATE_BUTTON);
  goog.dom.classes.add(createButton, low.ui.Css.CALL_TO_ACTION);

  goog.dom.setTextContent(this.getTitleCloseElement(), 'X');
};


/** @override */
low.ui.home.CreateGameDialog.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this,
      goog.ui.Dialog.EventType.SELECT,
      this.onSelect_);
};


/** @override */
low.ui.home.CreateGameDialog.prototype.focus = function() {
  goog.base(this, 'focus');
  this.getElementByFragment(
      low.ui.home.CreateGameDialog.Id_.NAME_INPUT).focus();
};


/**
 * @param {!goog.ui.Dialog.Event} e
 * @private
 */
low.ui.home.CreateGameDialog.prototype.onSelect_ = function(e) {
  if (low.ui.home.CreateGameDialog.Id_.CREATE_BUTTON == e.key) {
    // TODO Actually create a game.
    this.pageController_.setCurrentPage(low.ui.Page.WAITING_ROOM);
  }
};
