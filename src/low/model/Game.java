package low.model;

import java.util.List;

import com.google.code.twig.annotation.Embed;
import com.google.common.collect.Lists;

public class Game {

	@Embed private List<Player> players;
	
	public Game() {
		players = Lists.newArrayList();
	}
	
	public Game(String moderatorName) {
		this();
		Player moderator = new Player(moderatorName, true);
		players.add(moderator);
	}
	
	public void addPlayer(String name) {
		players.add(new Player(name, false));
	}
}
