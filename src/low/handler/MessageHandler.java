package low.handler;

import java.io.IOException;

import javax.annotation.Nullable;
import javax.servlet.http.HttpServletResponse;

import low.message.Message;

public interface MessageHandler {

	/**
	 * @param message
	 * @param res
	 * @return The message to send back to the client, if any.
	 * @throws IOException
	 */
	@Nullable
	Message handle(Message message, HttpServletResponse res) throws IOException;
}
