package low.module;

import low.filter.GameKeyFilter;
import low.servlet.ChannelsServlet;
import low.servlet.GameServlet;
import low.servlet.GamesServlet;
import low.servlet.HomeServlet;

import com.google.inject.servlet.ServletModule;

public class WaterdeepServletModule extends ServletModule {

	@Override
	protected void configureServlets() {
		
		filter("/game/*").through(GameKeyFilter.class);
		
		serve("/").with(HomeServlet.class);
		serve("/channels").with(ChannelsServlet.class);
		serve("/games").with(GamesServlet.class);
		serve("/game/*").with(GameServlet.class);
	}
}
