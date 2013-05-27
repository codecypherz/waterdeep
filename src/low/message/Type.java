package low.message;

/**
 * Enumerates all the types of messages.  This is used for deserialization.
 */
public enum Type {

	CONNECTED,
	CREATE_CHANNEL_RESPONSE,
	CREATE_GAME_REQUEST,
	JOIN_GAME_REQUEST,
	JOIN_GAME_RESPONSE,
	LEAVE_GAME_REQUEST,
	PLAYER_JOINED,
	PLAYER_LEFT,
	START_GAME_NOTIFICATION,
	START_GAME_REQUEST,
	UNKNOWN
}
