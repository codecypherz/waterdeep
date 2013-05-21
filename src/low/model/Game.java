package low.model;

import java.util.List;

import javax.annotation.Nullable;

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
	
	public boolean isFull() {
		return full;
	}
	
	public List<Player> getPlayers() {
		return players;
	}
	
	@Nullable
	public Player getModerator() {
		for (Player player : players) {
			if (player.isModerator()) {
				return player;
			}
		}
		return null;
	}
	
	public void addPlayer(Player player) {
		assert(!full);
		players.add(player);
		if (players.size() == MAX_PLAYERS) {
			full = true;
		}
	}
	
	/**
	 * Removes the player with the client ID.
	 * @param clientId The client ID of the player to remove.
	 * @return The removed player or null if not found.
	 */
	@Nullable
	public Player removePlayer(String clientId) {
		for (int i = 0; i < players.size(); i++) {
			Player player = players.get(i);
			if (player != null && player.getClientId().equals(clientId)) {
				players.remove(i);
				return player;
			}
		}
		return null;
	}
}
