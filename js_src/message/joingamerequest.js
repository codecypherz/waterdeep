
goog.provide('low.message.JoinGameRequest');

goog.require('low.message.Message');



/**
 * @param {string} name The name of the player joining.
 * @param {!low.model.Player.Color} color The player color.
 * @constructor
 * @implements {low.message.Message}
 */
low.message.JoinGameRequest = function(name, color) {

  /** @private {string} */
  this.name_ = name;

  /** @private {!low.model.Player.Color} */
  this.color_ = color;
};


/** @override */
low.message.JoinGameRequest.prototype.toJson = function() {
  return {
    'color': this.color_,
    'name': this.name_
  };
};
