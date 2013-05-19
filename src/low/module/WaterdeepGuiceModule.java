package low.module;

import low.annotation.ClientId;
import low.annotation.GameKey;
import low.provider.ClientIdProvider;
import low.provider.GameKeyProvider;
import low.service.GameService;
import low.service.MessageService;
import low.util.CookieUtil;
import low.util.KeyUtil;

import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.api.datastore.Key;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;

public class WaterdeepGuiceModule extends AbstractModule {

	@Override
	protected void configure() {
		
		// Providers
		bind(String.class).annotatedWith(ClientId.class)
			.toProvider(ClientIdProvider.class);
		bind(Key.class).annotatedWith(GameKey.class)
			.toProvider(GameKeyProvider.class);
		
		// Services
		// ChannelService is bound by provider method below.
		bind(GameService.class);
		bind(MessageService.class);
		
		// Utilities
		bind(CookieUtil.class);
		bind(KeyUtil.class);
	}
	
	@Provides
	private ChannelService getChannelService() {
		return ChannelServiceFactory.getChannelService();
	}
}
