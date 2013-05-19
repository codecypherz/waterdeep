
goog.provide('low.message.Type');


/**
 * Lists all the message types which are required for deserialization.
 * @enum {string}
 */
low.message.Type = {
  CREATE_CHANNEL_RESPONSE: 'create_channel_response',
  CREATE_GAME_REQUEST: 'create_game_request',
  JOIN_GAME_REQUEST: 'join_game_request',
  JOIN_GAME_RESPONSE: 'join_game_response',
  PLAYER_JOINED: 'player_joined',
  UNKNOWN: 'unknown'
};
