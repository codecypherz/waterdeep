package low.module;

import low.servlet.GamesServlet;
import low.servlet.HomeServlet;

import com.google.inject.servlet.ServletModule;

public class WaterdeepServletModule extends ServletModule {

	@Override
	protected void configureServlets() {
		
		serve("/").with(HomeServlet.class);
		serve("/games").with(GamesServlet.class);
	}
}
