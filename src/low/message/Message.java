package low.message;

public class Message {

	private Type type;
	
	public Message(Type type) {
		this.type = type;
	}
	
	public Type getType() {
		return this.type;
	}
}
