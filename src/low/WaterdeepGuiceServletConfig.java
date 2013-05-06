package low;

import low.module.TwigModule;
import low.module.WaterdeepGuiceModule;
import low.module.WaterdeepServletModule;

import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.servlet.GuiceServletContextListener;

public class WaterdeepGuiceServletConfig extends GuiceServletContextListener {

	@Override
	protected Injector getInjector() {
		return Guice.createInjector(
				
				// Datastore abstraction.
				new TwigModule(),
				
				// General bindings.
				new WaterdeepGuiceModule(),
				
				// Servlet configuration.
				new WaterdeepServletModule());
	}
}
