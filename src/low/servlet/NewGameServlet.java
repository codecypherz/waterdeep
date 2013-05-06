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
public class NewGameServlet extends HttpServlet {

	private static final long serialVersionUID = 3539936287142536820L;

	private final Provider<ObjectDatastore> datastoreProvider;
	
	@Inject
	public NewGameServlet(Provider<ObjectDatastore> datastoreProvider) {
		this.datastoreProvider = datastoreProvider;
	}

	/**
	 * Creates a new game object.
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
