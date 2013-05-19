package low.message;

/**
 * Enumerates all the types of messages.  This is used for deserialization.
 */
public enum Type {

	CREATE_CHANNEL_RESPONSE,
	CREATE_GAME_REQUEST,
	JOIN_GAME_REQUEST,
	JOIN_GAME_RESPONSE,
	PLAYER_JOINED,
	UNKNOWN
}
