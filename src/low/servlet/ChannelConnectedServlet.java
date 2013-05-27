package low.servlet;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import low.message.Message;
import low.message.Type;
import low.service.MessageService;

import com.google.appengine.api.channel.ChannelPresence;
import com.google.appengine.api.channel.ChannelService;
import com.google.inject.Inject;
import com.google.inject.Singleton;

@Singleton
public class ChannelConnectedServlet extends HttpServlet {
	
	private static final long serialVersionUID = 3354958826064453992L;
	
	private static final Logger logger = Logger.getLogger(ChannelConnectedServlet.class.getName());
	
	private final ChannelService channelService;
	private final MessageService messageService;
	
	@Inject
	public ChannelConnectedServlet(
			ChannelService channelService,
			MessageService messageService) {
		this.channelService = channelService;
		this.messageService = messageService;
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		
		ChannelPresence presence = channelService.parsePresence(req);
		String clientId = presence.clientId();
		
		logger.info("Client " + clientId + " just connected");
		messageService.send(clientId, new Message(Type.CONNECTED));
	}
}
