package low.model;

public class Player {

	private String name;
	private boolean moderator;

	public Player() {
	}
	
	public Player(String name, boolean moderator) {
		this.name = name;
		this.moderator = moderator;
	}
	
	public String getName() {
		return name;
	}
	
	public boolean isModerator() {
		return moderator;
	}
}
