
goog.provide('low.ui.home.ColorPicker');

goog.require('goog.array');
goog.require('goog.dom.classes');
goog.require('goog.events.EventType');
goog.require('goog.functions');
goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('low.model.Player');
goog.require('low.ui.home.soy');



/**
 * The component allowing the user to pick their color.
 * @param {low.model.Game=} opt_game The game by which to filter colors.
 * @constructor
 * @extends {goog.ui.Component}
 */
low.ui.home.ColorPicker = function(opt_game) {
  goog.base(this);

  /** @protected {goog.log.Logger} */
  this.logger = goog.log.getLogger('low.ui.home.ColorPicker');

  /** @private {!Object} */
  this.colorMap_ = goog.object.clone(low.ui.home.ColorPicker.COLOR_TO_CSS_MAP_);

  // Initialize available colors.
  if (opt_game) {
    goog.array.forEach(opt_game.getPlayers(), function(player) {
      delete this.colorMap_[player.getColor()];
    }, this);
  }

  /** @private {!low.model.Player.Color} */
  this.color_ = /** @type {!low.model.Player.Color} */ (
      goog.object.findKey(this.colorMap_, goog.functions.TRUE));
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
      this.colorMap_,
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
      this.colorMap_,
      function(cssClass, color, map) {
        this.getHandler().listen(
            this.getElementByFragment(color),
            goog.events.EventType.CLICK,
            this.onColorClick_);
      }, this);

  this.select_(this.color_);
};


/**
 * Selects the color for the element that was clicked.
 * @param {!goog.events.Event} e
 * @private
 */
low.ui.home.ColorPicker.prototype.onColorClick_ = function(e) {
  this.select_(
      this.getColorFromElement_(/** @type {Element} */ (e.currentTarget)));
};


/**
 * Sets the selected color to the given one and updates the UI.
 * @param {!low.model.Player.Color} newColor
 * @private
 */
low.ui.home.ColorPicker.prototype.select_ = function(newColor) {
  goog.log.info(this.logger, 'Selecting ' + newColor);
  this.color_ = newColor;
  goog.object.forEach(
      this.colorMap_,
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
  return /** @type {!low.model.Player.Color} */ (
      this.getFragmentFromId(element.id));
};
