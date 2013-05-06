package low.model;

import com.google.code.twig.ObjectDatastoreFactory;
import com.google.code.twig.annotation.Embed;

public class Game {

	static {
		ObjectDatastoreFactory.register(Game.class);		
	}

	@Embed private Player[] players;
	
	public Game() {
		players = new Player[5];
	}
	
	public void addPlayer(String name) {
		Player player = new Player(this, name);
		players[0] = player;
	}
}
