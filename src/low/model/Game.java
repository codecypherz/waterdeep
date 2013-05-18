package low.model;

import java.util.List;

import com.google.code.twig.annotation.Embed;
import com.google.code.twig.annotation.Store;
import com.google.common.collect.Lists;

public class Game {
	
	private static final int MAX_PLAYERS = 5;
	
	// This is just here so GSON can include this when sent to the client.
	@Store(false) private String key;
	
	private boolean full;
	
	@Embed private List<Player> players;
	
	public Game() {
		players = Lists.newArrayList();
		full = false;
	}
	
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	
	public List<Player> getPlayers() {
		return players;
	}
	
	public boolean isFull() {
		return full;
	}
	
	public void addPlayer(Player player) {
		assert(!full);
		players.add(player);
		if (players.size() == MAX_PLAYERS) {
			full = true;
		}
	}
}
