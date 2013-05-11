package low.service;

import java.util.Iterator;
import java.util.List;

import low.model.Game;
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
	public GameService(Provider<ObjectDatastore> datastoreProvider) {
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
	 * @param stringKey The string form of the key.
	 * @return The game, if found.
	 */
	public Game getGame(String stringKey) {
		Key key = KeyFactory.stringToKey(stringKey);
		ObjectDatastore datastore = datastoreProvider.get();
		Game game = datastore.load(key);
		game.setKey(KeyFactory.keyToString(key));
		return game;
	}
	
	/**
	 * Joins the game with the given name and color.
	 * @param name The name of the player.
	 * @param color Their color.
	 */
	public void joinGame(String stringKey, String name, Color color) {
		Key key = KeyFactory.stringToKey(stringKey);
		ObjectDatastore datastore = datastoreProvider.get();
		Game game = datastore.load(key);
		// TODO Make sure game exists.
		// TODO Make sure color isn't taken.
		game.addPlayer(name, color);
		datastore.update(game);
	}
}
