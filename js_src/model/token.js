
goog.provide('low.model.Token');



/**
 * Represents the parsed data things following the hash tag.
 * @param {!low.model.Page} page
 * @param {string=} opt_gameKey
 * @constructor
 */
low.model.Token = function(page, opt_gameKey) {

  /** @type {!low.model.Page} */
  this.page = page;

  /** @type {string} */
  this.gameKey = opt_gameKey || '';
};


/**
 * @return {string} The string representation of the token.
 */
low.model.Token.prototype.toString = function() {
  if (this.gameKey) {
    return this.page + '/' + this.gameKey;
  }
  return this.page;
};


/**
 * Checks if the given token is equal to this one.
 * @param {low.model.Token} other The to token to compare.
 * @return {boolean} True if the other token equals this one.
 */
low.model.Token.prototype.equals = function(other) {
  if (goog.isDefAndNotNull(other)) {
    return this.page == other.page && this.gameKey == other.gameKey;
  } else {
    return false;
  }
};
