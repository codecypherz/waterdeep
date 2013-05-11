package low.model;

import java.util.List;

import low.model.Player.Color;

import com.google.code.twig.annotation.Embed;
import com.google.code.twig.annotation.Store;
import com.google.common.collect.Lists;

public class Game {

	@Embed private List<Player> players;
	
	// This is just here so GSON can include this when sent to the client.
	@Store(false) private String key;
	
	public Game() {
		players = Lists.newArrayList();
	}
	
	public Game(String moderatorName, Color color) {
		this();
		Player moderator = new Player(moderatorName, color, true);
		players.add(moderator);
	}
	
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	
	public void addPlayer(String name, Color color) {
		players.add(new Player(name, color, false));
	}
}
