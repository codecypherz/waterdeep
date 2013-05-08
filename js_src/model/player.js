/**
 * The model for a player in a game.
 */

goog.provide('low.model.Player');

goog.require('goog.asserts');
goog.require('goog.object');
goog.require('goog.string');



/**
 * @param {string} name
 * @param {!low.model.Player.Color} color
 * @param {boolean} moderator
 * @constructor
 */
low.model.Player = function(name, color, moderator) {

  /** @private {string} */
  this.name_ = name;

  /** @private {!low.model.Player.Color} */
  this.color_ = color;

  /** @private {boolean} */
  this.moderator_ = moderator;
};


/**
 * @enum {string}
 */
low.model.Player.Color = {
  BLACK: 'black',
  BLUE: 'blue',
  GREEN: 'green',
  RED: 'red',
  YELLOW: 'yellow'
};


/** @return {string} */
low.model.Player.prototype.getName = function() {
  return this.name_;
};


/** @return {!low.model.Player.Color} */
low.model.Player.prototype.getColor = function() {
  return this.color_;
};


/** @return {boolean} */
low.model.Player.prototype.isModerator = function() {
  return this.moderator_;
};


/**
 * @param {!Object} json The JSON for a player object.
 * @return {!low.model.Player} The parsed player model.
 */
low.model.Player.fromJson = function(json) {
  var name = json['name'] || '';
  var moderator = json['moderator'] || false;
  var color = low.model.Player.getColorFromString(json['color'] || '');
  color = goog.asserts.assert(color);
  return new low.model.Player(name, color, moderator);
};


/**
 * @param {string} colorString The string to identify.
 * @return {low.model.Player.Color} The discovered color.
 */
low.model.Player.getColorFromString = function(colorString) {
  return /** @type {low.model.Player.Color} */ (goog.object.findValue(
      low.model.Player.Color,
      function(value, key, object) {
        return goog.string.caseInsensitiveCompare(value, colorString) == 0;
      }));
};
