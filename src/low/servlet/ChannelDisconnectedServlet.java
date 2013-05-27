package low.servlet;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.channel.ChannelPresence;
import com.google.appengine.api.channel.ChannelService;
import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class ChannelDisconnectedServlet extends HttpServlet {
	
	private static final long serialVersionUID = -8639972046979432559L;
	
private static final Logger logger = Logger.getLogger(ChannelDisconnectedServlet.class.getName());
	
	private final ChannelService channelService;
	
	@Inject
	public ChannelDisconnectedServlet(ChannelService channelService) {
		this.channelService = channelService;
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		
		ChannelPresence presence = channelService.parsePresence(req);
		logger.info("Client " + presence.clientId() + " just disconnected");
	}
}
