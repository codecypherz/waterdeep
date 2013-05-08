package low.servlet;

import java.io.IOException;
import java.util.Iterator;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import low.message.CreateGameRequest;
import low.model.Game;
import low.model.Player.Color;

import com.google.code.twig.ObjectDatastore;
import com.google.common.collect.Lists;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.Singleton;

/**
 * Servlet offering interaction with games.
 * POST here will result in a new game.
 * GET here will result in a list of games.
 */
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
	
	/**
	 * Creates a new game.
	 * @param req
	 * @param res
	 * @throws IOException
	 */
	public void doPost(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		
		Gson gson = new Gson();
		CreateGameRequest createGameRequest = gson.fromJson(
				req.getReader(), CreateGameRequest.class);
		
		// Validate the moderator name.
		String moderatorName = createGameRequest.getModeratorName();
		if (moderatorName == null || moderatorName.trim().isEmpty()) {
			res.sendError(HttpResponseCode.BAD_REQUEST.getCode());
			return;
		}
		
		// Validate the color.
		String colorString = createGameRequest.getColor();
		if (colorString == null || colorString.trim().isEmpty()) {
			res.sendError(HttpResponseCode.BAD_REQUEST.getCode());
			return;
		}
		Color color = Color.valueOf(colorString.toUpperCase());
		
		Game game = new Game(moderatorName, color);
		ObjectDatastore datastore = datastoreProvider.get();
		datastore.store().instance(game).now();
		
		// Send the resulting game back to the client.
		res.getWriter().write(gson.toJson(game));
	}
}
