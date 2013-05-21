
goog.provide('low.message.Type');


/**
 * Lists all the message types which are required for deserialization.
 * Note that this must match the enum declared in src/low/message/Type.java
 * and is case sensitive.
 * @enum {string}
 */
low.message.Type = {
  CREATE_CHANNEL_RESPONSE: 'CREATE_CHANNEL_RESPONSE',
  CREATE_GAME_REQUEST: 'CREATE_GAME_REQUEST',
  JOIN_GAME_REQUEST: 'JOIN_GAME_REQUEST',
  JOIN_GAME_RESPONSE: 'JOIN_GAME_RESPONSE',
  LEAVE_GAME_REQUEST: 'LEAVE_GAME_REQUEST',
  PLAYER_JOINED: 'PLAYER_JOINED',
  PLAYER_LEFT: 'PLAYER_LEFT',
  UNKNOWN: 'UNKNOWN'
};
