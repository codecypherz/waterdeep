package low.model;

public class Player {
	
	public enum Color {
		BLACK,
		BLUE,
		GREEN,
		RED,
		YELLOW
	}
	
	private String clientId;
	private String name;
	private boolean moderator;
	private Color color;
	
	public Player() {
	}
	
	public Player(String clientId, String name, Color color, boolean moderator) {
		this.clientId = clientId;
		this.name = name;
		this.color = color;
		this.moderator = moderator;
	}
	
	public String getClientId() {
		return clientId;
	}
	
	public String getName() {
		return name;
	}
	
	public Color getColor() {
		return color;
	}
	
	public boolean isModerator() {
		return moderator;
	}
}
