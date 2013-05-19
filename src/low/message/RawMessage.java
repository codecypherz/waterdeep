package low.message;

/**
 * This is used to deserialize the top level part of a message.  This is
 * convenient to user with GSON to extract the ultimate type of message.
 */
public class RawMessage {

	private String type;
	
	public String getType() {
		return type;
	}
}
