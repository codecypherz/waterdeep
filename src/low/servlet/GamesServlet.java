package low.servlet;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import low.model.Game;

import com.google.code.twig.ObjectDatastore;
import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.Singleton;

@Singleton
public class GamesServlet extends HttpServlet {

	private static final long serialVersionUID = 3083753472298567149L;

	private final Provider<ObjectDatastore> datastoreProvider;
	
	@Inject
	public GamesServlet(Provider<ObjectDatastore> datastoreProvider) {
		this.datastoreProvider = datastoreProvider;
	}
	
	/**
	 * Gets all the currently active games.
	 * @param req
	 * @param res
	 * @throws IOException
	 */
	public void doGet(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		
		Game game = new Game();
		game.addPlayer("James");
		
		ObjectDatastore datastore = datastoreProvider.get();
		datastore.store().instance(game).now();
	}
}
