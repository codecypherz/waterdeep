package low.module;

import low.servlet.GamesServlet;
import low.servlet.HomeServlet;
import low.servlet.NewGameServlet;

import com.google.inject.servlet.ServletModule;

public class WaterdeepServletModule extends ServletModule {

	@Override
	protected void configureServlets() {
		
		serve("/").with(HomeServlet.class);
		
		serve("/game/new").with(NewGameServlet.class);
		serve("/games").with(GamesServlet.class);
	}
}
