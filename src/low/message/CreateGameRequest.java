package low.message;

public class CreateGameRequest extends Message {
	
	private String moderatorName;
	private String color;
	
	public CreateGameRequest() {
		super(Type.CREATE_GAME_REQUEST);
	}
	
	public String getModeratorName() {
		return moderatorName;
	}
	
	public String getColor() {
		return color;
	}
}
