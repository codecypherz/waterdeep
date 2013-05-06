package low.servlet;

import java.io.IOException;
import java.util.Iterator;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import low.model.Game;

import com.google.code.twig.ObjectDatastore;
import com.google.common.collect.Lists;
import com.google.gson.Gson;
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

		ObjectDatastore datastore = datastoreProvider.get();
		Iterator<Game> gamesIterator = datastore.find().type(Game.class).now();
		
		Gson gson = new Gson();
		res.getWriter().write(gson.toJson(Lists.newArrayList(gamesIterator)));
	}
}
