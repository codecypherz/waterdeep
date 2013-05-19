package low.message;

public class JoinGameRequest extends Message {

	private String name;
	private String color;
	
	public JoinGameRequest() {
		super(Type.JOIN_GAME_REQUEST);
	}
	
	public String getName() {
		return name;
	}
	
	public String getColor() {
		return color;
	}
}
