package low.module;

import low.filter.GameKeyFilter;
import low.servlet.ChannelConnectedServlet;
import low.servlet.ChannelDisconnectedServlet;
import low.servlet.ChannelsServlet;
import low.servlet.GameServlet;
import low.servlet.GamesServlet;
import low.servlet.HomeServlet;

import com.google.inject.servlet.ServletModule;

public class WaterdeepServletModule extends ServletModule {

	@Override
	protected void configureServlets() {
		
		// Makes sure all /game requests have a game key.
		filter("/game/*").through(GameKeyFilter.class);
		
		// Serves the web page.
		serve("/").with(HomeServlet.class);
		
		// Servlets for the channel.
		serve("/channels").with(ChannelsServlet.class);
		serve("/_ah/channel/connected*").with(ChannelConnectedServlet.class);
		serve("/_ah/channel/disconnected*").with(ChannelDisconnectedServlet.class);
		
		// Servlets for games.
		serve("/games").with(GamesServlet.class);
		serve("/game/*").with(GameServlet.class);
	}
}
