package low.model;

public class Player {
	
	public enum Color {
		BLACK,
		BLUE,
		GREEN,
		RED,
		YELLOW
	}
	
	private String name;
	private boolean moderator;
	private Color color;
	
	public Player() {
	}
	
	public Player(String name, Color color, boolean moderator) {
		this.name = name;
		this.color = color;
		this.moderator = moderator;
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
