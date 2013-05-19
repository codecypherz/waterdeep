package low.message;

public class Message {

	private Type type;
	
	/**
	 * This is used to make GSON happy when deserializing.  It requires a no-arg
	 * constructor (either private or public).
	 */
	@SuppressWarnings("unused")
	private Message() {
		this.type = Type.UNKNOWN;
	}
	
	public Message(Type type) {
		this.type = type;
	}
	
	public Type getType() {
		return this.type;
	}
}
