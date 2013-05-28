
goog.provide('low.model.Tavern');



/**
 * The model for a player's tavern.
 * @param {number} gold
 * @constructor
 */
low.model.Tavern = function(gold) {

  /** @private {number} */
  this.gold_ = gold;
};


/** @return {number} */
low.model.Tavern.prototype.getGold = function() {
  return this.gold_;
};


/**
 * @param {!Object} json The JSON for a player's tavern object.
 * @return {!low.model.Tavern} The parsed tavern model.
 */
low.model.Tavern.fromJson = function(json) {
  return new low.model.Tavern(json['gold'] || 0);
};
