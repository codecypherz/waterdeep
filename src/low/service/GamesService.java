package low.service;

import static com.google.appengine.api.datastore.Query.FilterOperator.EQUAL;

import java.util.Iterator;
import java.util.List;

import low.model.Game;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.code.twig.ObjectDatastore;
import com.google.common.collect.Lists;
import com.google.inject.Inject;
import com.google.inject.Provider;

/**
 * Service responsible for dealing with querying active games.
 */
public class GamesService {
	
	private final Provider<ObjectDatastore> datastoreProvider;
	
	@Inject
	public GamesService(Provider<ObjectDatastore> datastoreProvider) {
		this.datastoreProvider = datastoreProvider;
	}
	
	/**
	 * @return The list of currently active games.
	 */
	public List<Game> findActiveGames() {
		
		ObjectDatastore datastore = datastoreProvider.get();
		Iterator<Game> iterator = datastore
				.find()
				.type(Game.class)
				.addFilter("started", EQUAL, false)
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
}
