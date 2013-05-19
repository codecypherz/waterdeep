package low.service;

import static com.google.appengine.api.datastore.Query.FilterOperator.EQUAL;

import java.util.Iterator;
import java.util.List;
import java.util.logging.Logger;

import javax.annotation.Nullable;

import low.annotation.ClientId;
import low.message.JoinGameResponse;
import low.message.JoinGameResponse.Result;
import low.message.PlayerJoinedMessage;
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
	
	private static final Logger logger = Logger.getLogger(GameService.class.getName());
	
	private final Provider<ObjectDatastore> datastoreProvider;
	private final Provider<String> clientIdProvider;
	private final MessageService messageService;
	
	@Inject
	public GameService(
			Provider<ObjectDatastore> datastoreProvider,
			@ClientId Provider<String> clientIdProvider,
			MessageService messageService) {
		this.datastoreProvider = datastoreProvider;
		this.clientIdProvider = clientIdProvider;
		this.messageService = messageService;
	}
	
	/**
	 * @return The list of currently active games.
	 */
	public List<Game> findActiveGames() {
		
		// TODO Filter out games that have been started but not yet deleted.
		
		ObjectDatastore datastore = datastoreProvider.get();
		Iterator<Game> iterator = datastore
				.find()
				.type(Game.class)
				.addFilter("full", EQUAL, false)
				.now();
		
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
		String clientId = clientIdProvider.get();
		
		Game game = new Game();
		game.addPlayer(new Player(clientId, moderatorName, color, true));
		
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
	@Nullable
	public Game getGame(Key key) {
		ObjectDatastore datastore = datastoreProvider.get();
		Game game = datastore.load(key);
		if (game != null) {
			game.setKey(KeyFactory.keyToString(key));			
		}
		return game;
	}
	
	/**
	 * Joins the game with the given name and color.
	 * @param key The key of the game.
	 * @param name The name of the player.
	 * @param color Their color.
	 * @return The result of the join game attempt.
	 */
	public JoinGameResponse joinGame(Key key, String name, Color color) {
		logger.info(name + " is attempting to join this game: " + key);
		Game game = getGame(key);
		if (game == null) {
			return new JoinGameResponse(Result.NOT_FOUND);
		}
		
		// Make sure this client isn't already in this game.
		String clientId = clientIdProvider.get();
		for (Player player : game.getPlayers()) {
			if (clientId.equals(player.getClientId())) {
				return new JoinGameResponse(Result.ALREADY_JOINED);
			}
		}
		
		// Make sure the game isn't full.
		if (game.isFull()) {
			return new JoinGameResponse(Result.GAME_FULL);
		}
		
		// Make sure the color isn't taken.
		for (Player player : game.getPlayers()) {
			if (player.getColor() == color) {
				return new JoinGameResponse(Result.COLOR_TAKEN);
			}
		}
		
		// Update the game.
		Player player = new Player(clientId, name, color, false);
		game.addPlayer(player);
		ObjectDatastore datastore = datastoreProvider.get();
		datastore.update(game);
		
		// Notify all other players.
		messageService.broadcast(game, new PlayerJoinedMessage(player));
		
		return new JoinGameResponse(Result.SUCCESS, game);
	}
}
