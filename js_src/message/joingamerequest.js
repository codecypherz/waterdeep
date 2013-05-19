
goog.provide('low.message.JoinGameRequest');

goog.require('low.message.Message');
goog.require('low.message.Type');



/**
 * @param {string} name The name of the player joining.
 * @param {!low.model.Player.Color} color The player color.
 * @constructor
 * @extends {low.message.Message}
 */
low.message.JoinGameRequest = function(name, color) {
  goog.base(this, low.message.Type.JOIN_GAME_REQUEST);

  /** @private {string} */
  this.name_ = name;

  /** @private {!low.model.Player.Color} */
  this.color_ = color;
};
goog.inherits(low.message.JoinGameRequest, low.message.Message);


/** @override */
low.message.JoinGameRequest.prototype.toJson = function() {
  var json = goog.base(this, 'toJson');
  json['color'] = this.color_;
  json['name'] = this.name_;
  return json;
};
