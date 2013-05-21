package low.servlet;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import low.annotation.ClientId;
import low.message.CreateChannelResponse;
import low.service.CookieService;

import com.google.appengine.api.channel.ChannelService;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.Singleton;

/**
 * Servlet responsible for creating channels.
 *
 *  - POST: Creates a new channel
 *
 */
@Singleton
public class ChannelsServlet extends HttpServlet {

	private static final long serialVersionUID = 89223740767771916L;

	private static final Logger logger = Logger.getLogger(ChannelsServlet.class.getName());
	
	private final ChannelService channelService;
	private final @ClientId Provider<String> clientIdProvider;
	private final CookieService cookieService;
	
	@Inject
	public ChannelsServlet(
			ChannelService channelService,
			@ClientId Provider<String> clientIdProvider,
			CookieService cookieService) {
		this.channelService = channelService;
		this.clientIdProvider = clientIdProvider;
		this.cookieService = cookieService;
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		
		// Create the channel.
		String clientId = clientIdProvider.get();
		String token = channelService.createChannel(clientId);
		logger.info("Created a channel" +
				"\n  client: " + clientId +
				"\n  token: " + token);
		
		// Write the response.
		Gson gson = new Gson();
		CreateChannelResponse response = new CreateChannelResponse(token);
		cookieService.setClientId();
		res.getWriter().write(gson.toJson(response));
	}
}
