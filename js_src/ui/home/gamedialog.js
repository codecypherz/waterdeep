/**
 * The prompt to create a new game.
 */

goog.provide('low.ui.home.GameDialog');

goog.require('goog.async.Deferred');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.log');
goog.require('goog.soy');
goog.require('goog.string');
goog.require('goog.ui.Dialog');
goog.require('low');
goog.require('low.ui');
goog.require('low.ui.Css');
goog.require('low.ui.home.ColorPicker');
goog.require('low.ui.home.soy');



/**
 * @constructor
 * @param {string} titleText
 * @param {string} confirmText
 * @extends {goog.ui.Dialog}
 */
low.ui.home.GameDialog = function(titleText, confirmText) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.home.GameDialog');

  /** @private {!low.ui.home.ColorPicker} */
  this.colorPicker_ = new low.ui.home.ColorPicker();
  this.addChild(this.colorPicker_);

  /** @private {goog.async.Deferred} */
  this.deferred_ = null;

  this.setTitle(titleText);
  this.setDisposeOnHide(true);

  var buttonSet = new goog.ui.Dialog.ButtonSet()
      .addButton({
        key: low.ui.home.GameDialog.Id_.CONFIRM_BUTTON,
        caption: confirmText
      }, true)
      .addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, false, true);
  this.setButtonSet(buttonSet);
};
goog.inherits(low.ui.home.GameDialog, goog.ui.Dialog);


/**
 * @enum {string}
 * @private
 */
low.ui.home.GameDialog.Id_ = {
  COLOR_PICKER: low.getUniqueId('color-picker'),
  CONFIRM_BUTTON: low.getUniqueId('confirm-button'),
  NAME_INPUT: low.getUniqueId('name-input')
};


/**
 * Prompts the user for their color and name.
 * @return {!goog.async.Deferred} The callback is called when the user confirms.
 */
low.ui.home.GameDialog.prototype.prompt = function() {
  this.deferred_ = new goog.async.Deferred();
  this.setVisible(true);
  return this.deferred_;
};


/**
 * @return {string} The name the user has entered.
 */
low.ui.home.GameDialog.prototype.getName = function() {
  return this.getElementByFragment(
      low.ui.home.GameDialog.Id_.NAME_INPUT).value;
};


/**
 * @return {!low.model.Player.Color} The chosen color.
 */
low.ui.home.GameDialog.prototype.getColor = function() {
  return this.colorPicker_.getColor();
};


/** @override */
low.ui.home.GameDialog.prototype.createDom = function() {
  goog.base(this, 'createDom');

  // Don't use setContent because that requires a string.  It doesn't make sense
  // to render the template as a string just to accommodate a limitation in the
  // dialog class.
  this.getContentElement().appendChild(goog.soy.renderAsElement(
      low.ui.home.soy.CREATE_GAME_CONTENT, {
        ids: this.makeIds(low.ui.home.GameDialog.Id_)
      }));

  this.colorPicker_.render(low.ui.getElementByFragment(
      this, low.ui.home.GameDialog.Id_.COLOR_PICKER));

  var confirmButton = this.getButtonSet().getButton(
      low.ui.home.GameDialog.Id_.CONFIRM_BUTTON);
  goog.dom.classes.add(confirmButton, low.ui.Css.CALL_TO_ACTION);

  goog.dom.setTextContent(this.getTitleCloseElement(), 'X');
};


/** @override */
low.ui.home.GameDialog.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this,
      goog.ui.Dialog.EventType.SELECT,
      this.onSelect_);
};


/** @override */
low.ui.home.GameDialog.prototype.focus = function() {
  goog.base(this, 'focus');
  this.getElementByFragment(
      low.ui.home.GameDialog.Id_.NAME_INPUT).focus();
};


/**
 * @param {!goog.ui.Dialog.Event} e
 * @private
 */
low.ui.home.GameDialog.prototype.onSelect_ = function(e) {
  if (low.ui.home.GameDialog.Id_.CONFIRM_BUTTON == e.key) {

    // Validate the name.
    var nameInput = this.getElementByFragment(
        low.ui.home.GameDialog.Id_.NAME_INPUT);
    var name = nameInput.value;
    if (goog.string.isEmptySafe(name)) {
      nameInput.select();
      e.preventDefault();
      return;
    }

    this.deferred_.callback();
    this.deferred_ = null;
  }
};
