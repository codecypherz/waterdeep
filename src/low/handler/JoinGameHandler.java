package low.handler;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import low.annotation.GameKey;
import low.message.JoinGameRequest;
import low.message.Message;
import low.model.Player.Color;
import low.service.GameService;
import low.servlet.HttpResponseCode;

import com.google.appengine.api.datastore.Key;
import com.google.inject.Inject;
import com.google.inject.Provider;

public class JoinGameHandler implements MessageHandler {

	private final @GameKey Provider<Key> gameKeyProvider;
	private final GameService gameService;
	
	@Inject
	public JoinGameHandler(
			@GameKey Provider<Key> gameKeyProvider,
			GameService gameService) {
		this.gameKeyProvider = gameKeyProvider;
		this.gameService = gameService;
	}
	
	@Override
	public Message handle(Message message, HttpServletResponse res)
			throws IOException {
		JoinGameRequest joinGameRequest = (JoinGameRequest) message;
		
		// Validate the moderator name.
		String name = joinGameRequest.getName();
		if (name == null || name.trim().isEmpty()) {
			res.sendError(HttpResponseCode.BAD_REQUEST.getCode());
			return null;
		}
		
		// Validate the color.
		String colorString = joinGameRequest.getColor();
		if (colorString == null || colorString.trim().isEmpty()) {
			res.sendError(HttpResponseCode.BAD_REQUEST.getCode());
			return null;
		}
		Color color = Color.valueOf(colorString.toUpperCase());
		
		// Try to join the game and send the result.
		return gameService.joinGame(gameKeyProvider.get(), name, color);
	}
}
