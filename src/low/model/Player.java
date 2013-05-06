package low.model;

import com.google.code.twig.annotation.Parent;

public class Player {

	@Parent private Game game;

	private String name;
	
	public Player() {
	}
	
	public Player(Game game, String name) {
		this.game = game;
		this.name = name;
	}
	
	public String getName() {
		return name;
	}
}
