package low.module;

import low.annotation.GameKey;
import low.provider.GameKeyProvider;
import low.service.GameService;
import low.util.KeyUtil;

import com.google.appengine.api.datastore.Key;
import com.google.inject.AbstractModule;

public class WaterdeepGuiceModule extends AbstractModule {

	@Override
	protected void configure() {
		
		bind(Key.class).annotatedWith(GameKey.class)
			.toProvider(GameKeyProvider.class);
		
		bind(GameService.class);
		bind(KeyUtil.class);
	}
}
