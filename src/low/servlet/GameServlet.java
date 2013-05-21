package low.servlet;

import java.io.IOException;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import low.annotation.GameKey;
import low.annotation.RequestMessage;
import low.message.Message;
import low.model.Game;
import low.service.GameService;
import low.service.MessageHandlerService;
import low.util.CookieUtil;

import com.google.appengine.api.datastore.Key;
import com.google.gson.Gson;
import com.google.inject.Provider;
import com.google.inject.Singleton;

/**
 * Servlet for interacting with a specific game.
 */
@Singleton
public class GameServlet extends HttpServlet {

	private static final long serialVersionUID = 2537789499822803611L;
	
	private static final Logger logger = Logger.getLogger(GameServlet.class.getName());
	
	private final GameService gameService;
	private final @GameKey Provider<Key> gameKeyProvider;
	private final @RequestMessage Provider<Message> requestMessageProvider;
	private final CookieUtil cookieUtil;
	private final MessageHandlerService messageHandlerService;
	
	@Inject
	public GameServlet(
			GameService gameService,
			@GameKey Provider<Key> gameKeyProvider,
			@RequestMessage Provider<Message> requestMessageProvider,
			CookieUtil cookieUtil,
			MessageHandlerService messageHandlerService) {
		this.gameService = gameService;
		this.gameKeyProvider = gameKeyProvider;
		this.requestMessageProvider = requestMessageProvider;
		this.cookieUtil = cookieUtil;
		this.messageHandlerService = messageHandlerService;
	}
	
	/**
	 * Attempts to join the specific game.
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		
		logger.info("Fetching game for this key: " + gameKeyProvider.get());
		Game game = gameService.getGame(gameKeyProvider.get());
		if (game == null) {
			res.sendError(HttpResponseCode.NOT_FOUND.getCode());
			return;
		}

		res.getWriter().write(new Gson().toJson(game));
	}
	
	/**
	 * Attempts to join the specific game.
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		
		Message message = requestMessageProvider.get();
		if (message == null) {
			res.sendError(HttpResponseCode.BAD_REQUEST.getCode());
			return;
		}
		
		// Handle the message.
		Message response = messageHandlerService.handle(message, res);
		if (response != null) {
			res.getWriter().write(new Gson().toJson(response));			
		}

		// TODO Cut across all responses and do this there instead of each servlet.
		// Always include the client ID.
		cookieUtil.setClientId();
	}
}
