package low.service;

import java.io.IOException;
import java.util.Map;
import java.util.logging.Logger;

import javax.annotation.Nullable;
import javax.servlet.http.HttpServletResponse;

import low.handler.JoinGameHandler;
import low.handler.LeaveGameHandler;
import low.handler.MessageHandler;
import low.message.Message;
import low.message.Type;

import com.google.common.collect.Maps;
import com.google.inject.Inject;

/**
 * Service for conveniently handling messages.
 */
public class MessageHandlerService {

	private static final Logger logger = Logger.getLogger(MessageHandlerService.class.getName());
	
	private final Map<Type, MessageHandler> typeToHandlerMap;
	
	@Inject
	public MessageHandlerService(
			JoinGameHandler joinGameHandler,
			LeaveGameHandler leaveGameHandler) {
		
		// Register message handlers.
		typeToHandlerMap = Maps.newHashMap();
		typeToHandlerMap.put(Type.JOIN_GAME_REQUEST, joinGameHandler);
		typeToHandlerMap.put(Type.LEAVE_GAME_REQUEST, leaveGameHandler);
	}
	
	/**
	 * @param message
	 * @param res
	 * @return The message to send back to the client, if any.
	 * @throws IOException
	 */
	@Nullable
	public Message handle(Message message, HttpServletResponse res)
			throws IOException {
		logger.info("Handling message with this type: " + message.getType());
		MessageHandler handler = typeToHandlerMap.get(message.getType());
		return handler.handle(message, res);
	}
}
