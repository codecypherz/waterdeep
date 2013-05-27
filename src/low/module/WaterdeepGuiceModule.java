package low.module;

import low.annotation.ClientId;
import low.annotation.GameKey;
import low.annotation.RequestMessage;
import low.handler.JoinGameHandler;
import low.handler.LeaveGameHandler;
import low.handler.StartGameHandler;
import low.message.Message;
import low.provider.ClientIdProvider;
import low.provider.GameKeyProvider;
import low.provider.RequestMessageProvider;
import low.service.CookieService;
import low.service.GameService;
import low.service.GamesService;
import low.service.KeyService;
import low.service.MessageHandlerService;
import low.service.MessageService;

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
		bind(Message.class).annotatedWith(RequestMessage.class)
			.toProvider(RequestMessageProvider.class);
		
		// Services
		// ChannelService is bound by provider method below.
		bind(CookieService.class);
		bind(GameService.class);
		bind(GamesService.class);
		bind(KeyService.class);
		bind(MessageService.class);
		bind(MessageHandlerService.class);
		
		// Message handlers.
		bind(JoinGameHandler.class);
		bind(LeaveGameHandler.class);
		bind(StartGameHandler.class);
	}
	
	@Provides
	private ChannelService getChannelService() {
		return ChannelServiceFactory.getChannelService();
	}
}
