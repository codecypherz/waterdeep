package low.module;

import low.service.GameService;

import com.google.inject.AbstractModule;

public class WaterdeepGuiceModule extends AbstractModule {

	@Override
	protected void configure() {
		bind(GameService.class);
	}
}
