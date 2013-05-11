package low.servlet;

import java.io.IOException;
import java.net.URI;

import javax.inject.Inject;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import low.message.JoinGameRequest;
import low.model.Player.Color;
import low.service.GameService;

import com.google.gson.Gson;
import com.google.inject.Singleton;

/**
 * Servlet for interacting with a specific game.
 */
@Singleton
public class GameServlet extends HttpServlet {

	private static final long serialVersionUID = 2537789499822803611L;
	
	private final GameService gameService;
	
	@Inject
	public GameServlet(GameService gameService) {
		this.gameService = gameService;
	}
	
	/**
	 * Attempts to join the specific game.
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		
		String gameKey = getGameKey(req);
		if (gameKey == null) {
			res.sendError(HttpResponseCode.BAD_REQUEST.getCode());
			return;
		}
		
		res.getWriter().write(new Gson().toJson(gameService.getGame(gameKey)));
	}
	
	/**
	 * Attempts to join the specific game.
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		
		String gameKey = getGameKey(req);
		if (gameKey == null) {
			res.sendError(HttpResponseCode.BAD_REQUEST.getCode());
			return;
		}
		
		Gson gson = new Gson();
		JoinGameRequest joinGameRequest = gson.fromJson(
				req.getReader(), JoinGameRequest.class);
		
		// Validate the moderator name.
		String name = joinGameRequest.getName();
		if (name == null || name.trim().isEmpty()) {
			res.sendError(HttpResponseCode.BAD_REQUEST.getCode());
			return;
		}
		
		// Validate the color.
		String colorString = joinGameRequest.getColor();
		if (colorString == null || colorString.trim().isEmpty()) {
			res.sendError(HttpResponseCode.BAD_REQUEST.getCode());
			return;
		}
		Color color = Color.valueOf(colorString.toUpperCase());
		
		gameService.joinGame(gameKey, name, color);
	}
	
	/**
	 * Gets the game key from the path of the request.
	 * @param req The request.
	 * @return The game key in the request path or null if there wasn't one.
	 */
	private String getGameKey(HttpServletRequest req) {
		// TODO Move this to a filter for this servlet and inject the key.
		URI uri = URI.create(req.getRequestURI());
		String[] pathParts = uri.getPath().split("/");
		// Path is something like /game/1234 which would be ["","game","1234"]
		if (pathParts.length > 2) {
			String gameKey = pathParts[2];
			if (gameKey != null && !gameKey.isEmpty()) {
				return gameKey;
			}
		}
		return null;
	}
}
