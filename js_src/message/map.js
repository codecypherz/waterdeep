
goog.provide('low.message.Map');

goog.require('goog.object');
goog.require('low.message.PlayerJoined');
goog.require('low.message.PlayerLeft');
goog.require('low.message.Type');


/**
 * Lists all the message types which are required for deserialization.
 * @type {!Object.<!low.message.Type, !function(!Object):!low.message.Message>}
 */
low.message.Map = goog.object.create(
    low.message.Type.PLAYER_JOINED, low.message.PlayerJoined.fromJson,
    low.message.Type.PLAYER_LEFT, low.message.PlayerLeft.fromJson
    );
