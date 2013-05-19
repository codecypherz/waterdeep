
goog.provide('low.message.Message');



/**
 * Represents a message either sent to the server or received from the server.
 * @param {string} type The type of message.
 * @constructor
 */
low.message.Message = function(type) {

  /** @private {string} */
  this.type_ = type;
};


/**
 * @return {!Object}
 */
low.message.Message.prototype.toJson = function() {
  return {
    'type': this.type_
  };
};
