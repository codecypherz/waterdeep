/**
 * The component allowing the user to pick their color.
 */

goog.provide('low.ui.home.ColorPicker');

goog.require('goog.dom.classes');
goog.require('goog.events.EventType');
goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('low.model.Player');
goog.require('low.ui.home.soy');



/**
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.home.ColorPicker = function() {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.home.ColorPicker');

  /** @private {!low.model.Player.Color} */
  this.color_ = low.model.Player.Color.BLACK;
};
goog.inherits(low.ui.home.ColorPicker, goog.ui.Component);


/** @private {!Object} */
low.ui.home.ColorPicker.COLOR_TO_CSS_MAP_ = goog.object.create(
    low.model.Player.Color.BLACK, goog.getCssName('holder-black-50'),
    low.model.Player.Color.GREEN, goog.getCssName('holder-green-50'),
    low.model.Player.Color.YELLOW, goog.getCssName('holder-yellow-50'),
    low.model.Player.Color.RED, goog.getCssName('holder-red-50'),
    low.model.Player.Color.BLUE, goog.getCssName('holder-blue-50')
    );


/**
 * @enum {string}
 * @private
 */
low.ui.home.ColorPicker.Css_ = {
  SELECTED: goog.getCssName('low-color-selected')
};


/**
 * @return {!low.model.Player.Color} The currently selected color.
 */
low.ui.home.ColorPicker.prototype.getColor = function() {
  return this.color_;
};


/** @override */
low.ui.home.ColorPicker.prototype.createDom = function() {

  // Create the template data.
  var colors = [];
  goog.object.forEach(
      low.ui.home.ColorPicker.COLOR_TO_CSS_MAP_,
      function(cssClass, color, map) {
        colors.push({
          'id': this.makeId(color),
          'iconClass': cssClass
        });
      }, this);

  // Render the template.
  this.setElementInternal(goog.soy.renderAsElement(
      low.ui.home.soy.COLOR_PICKER, {
        colors: colors
      }));
};


/** @override */
low.ui.home.ColorPicker.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  goog.object.forEach(
      low.ui.home.ColorPicker.COLOR_TO_CSS_MAP_,
      function(cssClass, color, map) {
        this.getHandler().listen(
            this.getElementByFragment(color),
            goog.events.EventType.CLICK,
            this.onColorClick_);
      }, this);

  this.select_(this.color_);
};


/**
 * Selects the color.
 * @private
 */
low.ui.home.ColorPicker.prototype.onColorClick_ = function(e) {
  this.select_(this.getColorFromElement_(e.currentTarget));
};


/**
 * Sets the selected color to the given one and updates the UI.
 * @param {!low.model.Color.Picker} color
 * @private
 */
low.ui.home.ColorPicker.prototype.select_ = function(newColor) {
  window.console.info('Selecting ' + newColor);
  this.color_ = newColor;
  goog.object.forEach(
      low.ui.home.ColorPicker.COLOR_TO_CSS_MAP_,
      function(cssClass, color, map) {
        var element = this.getElementByFragment(color);
        goog.dom.classes.enable(element,
            low.ui.home.ColorPicker.Css_.SELECTED,
            this.color_ == color);
      }, this);
};


/**
 * @param {Element} element
 * @return {!low.model.Player.Color} The color the element represents.
 * @private
 */
low.ui.home.ColorPicker.prototype.getColorFromElement_ = function(element) {
  return this.getFragmentFromId(element.id);
};
