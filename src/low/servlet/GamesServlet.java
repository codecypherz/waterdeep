package low.servlet;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import low.message.CreateGameRequest;
import low.model.Game;
import low.model.Player.Color;
import low.service.CookieService;
import low.service.GameService;
import low.service.GamesService;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Singleton;

/**
 * Servlet offering interaction with games.
 *
 *  - POST: Creates a new game.
 *  -  GET: Lists all active games.
 *
 */
@Singleton
public class GamesServlet extends HttpServlet {

	private static final long serialVersionUID = 3083753472298567149L;

	private final GameService gameService;
	private final GamesService gamesService;
	private final CookieService cookieService;
	
	@Inject
	public GamesServlet(
			GameService gameService,
			GamesService gamesService,
			CookieService cookieService) {
		this.gameService = gameService;
		this.gamesService = gamesService;
		this.cookieService = cookieService;
	}
	
	/**
	 * Gets all the currently active games.
	 */
	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse res)
			throws IOException {

		List<Game> games = gamesService.findActiveGames();
		
		Gson gson = new Gson();
		res.getWriter().write(gson.toJson(games));
	}
	
	/**
	 * Creates a new game.
	 */
	@Override
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
		
		// Send the resulting game back to the client.
		Game game = gameService.newGame(moderatorName, color);
		cookieService.setClientId();
		res.getWriter().write(gson.toJson(game));
	}
}
