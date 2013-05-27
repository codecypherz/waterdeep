
goog.provide('low.message.Message');



/**
 * Represents a message either sent to the server or received from the server.
 * @param {!low.message.Type} type The type of message.
 * @constructor
 */
low.message.Message = function(type) {

  /** @private {!low.message.Type} */
  this.type_ = type;
};


/**
 * @return {!low.message.Type}
 */
low.message.Message.prototype.getType = function() {
  return this.type_;
};


/**
 * @return {!Object}
 */
low.message.Message.prototype.toJson = function() {
  return {
    'type': this.type_
  };
};
