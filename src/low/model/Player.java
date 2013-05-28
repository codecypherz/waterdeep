package low.model;

import com.google.code.twig.annotation.Embed;

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
	private boolean firstPlayer;
	
	@Embed private Tavern tavern;
	
	public Player() {
	}
	
	public Player(String clientId, String name, Color color, boolean moderator) {
		this.clientId = clientId;
		this.name = name;
		this.color = color;
		this.moderator = moderator;
		
		this.firstPlayer = false;
		this.tavern = new Tavern();
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
	public void setModerator(boolean moderator) {
		this.moderator = moderator;
	}
	
	public boolean isFirstPlayer() {
		return firstPlayer;
	}
	public void setFirstPlayer(boolean firstPlayer) {
		this.firstPlayer = firstPlayer;
	}
	
	public Tavern getTavern() {
		return tavern;
	}
}
