package low.service;

import java.util.Iterator;
import java.util.List;

import low.model.Game;
import low.model.Player;
import low.model.Player.Color;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.code.twig.ObjectDatastore;
import com.google.common.collect.Lists;
import com.google.inject.Inject;
import com.google.inject.Provider;

public class GameService {

	private final Provider<ObjectDatastore> datastoreProvider;
	
	@Inject
	public GameService(
			Provider<ObjectDatastore> datastoreProvider) {
		this.datastoreProvider = datastoreProvider;
	}
	
	/**
	 * @return The list of currently active games.
	 */
	public List<Game> findActiveGames() {

		// TODO Filter out inactive games.
		ObjectDatastore datastore = datastoreProvider.get();
		Iterator<Game> iterator = datastore.find().type(Game.class).now();
		List<Game> games = Lists.newArrayList();
		while (iterator.hasNext()) {
			Game game = iterator.next();
			Key key = datastore.associatedKey(game);
			game.setKey(KeyFactory.keyToString(key));
			games.add(game);
		}
		return games;
	}
	
	/**
	 * Creates a new game and immediate stores it in the database.
	 * @param moderatorName The name of the moderator.
	 * @param color The moderator's color.
	 * @return The new game reference.
	 */
	public Game newGame(String moderatorName, Color color) {
		ObjectDatastore datastore = datastoreProvider.get();
		Game game = new Game(moderatorName, color);
		datastore.store().instance(game).now();
		Key key = datastore.associatedKey(game);
		game.setKey(KeyFactory.keyToString(key));
		return game;
	}
	
	/**
	 * Gets the game for the given key.
	 * @param key The game's key.
	 * @return The game, if found.
	 */
	public Game getGame(Key key) {
		ObjectDatastore datastore = datastoreProvider.get();
		Game game = datastore.load(key);
		game.setKey(KeyFactory.keyToString(key));
		return game;
	}
	
	/**
	 * Joins the game with the given name and color.
	 * @param key The key of the game.
	 * @param name The name of the player.
	 * @param color Their color.
	 * @return True if successful, false if the color has been chosen.
	 */
	public boolean joinGame(Key key, String name, Color color) {
		ObjectDatastore datastore = datastoreProvider.get();
		Game game = datastore.load(key);
		
		// Make sure the color isn't taken.
		for (Player player : game.getPlayers()) {
			if (player.getColor() == color) {
				return false;
			}
		}
		
		game.addPlayer(name, color);
		datastore.update(game);
		return true;
	}
}
