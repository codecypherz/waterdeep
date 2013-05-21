package low.provider;

import java.net.URI;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

import low.service.KeyService;

import com.google.appengine.api.datastore.Key;
import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.servlet.RequestScoped;

@RequestScoped
public class GameKeyProvider implements Provider<Key> {

	private static final Logger logger = Logger.getLogger(GameKeyProvider.class.getName());
	
	private final Provider<HttpServletRequest> requestProvider;
	private final KeyService keyService;
	
	@Inject
	public GameKeyProvider(
			Provider<HttpServletRequest> requestProvider,
			KeyService keyService) {
		this.requestProvider = requestProvider;
		this.keyService = keyService;
	}
	
	@Override
	public Key get() {
		HttpServletRequest req = requestProvider.get();
		URI uri = URI.create(req.getRequestURI());
		String[] pathParts = uri.getPath().split("/");
		// Path is something like /game/1234 which would be ["","game","1234"]
		if (pathParts.length > 2) {
			String gameKey = pathParts[2];
			if (gameKey != null && !gameKey.isEmpty()) {
				logger.info("Providing this game key for the request: " + gameKey);
				return keyService.getKey(gameKey);
			}
		}
		return null;
	}
}
