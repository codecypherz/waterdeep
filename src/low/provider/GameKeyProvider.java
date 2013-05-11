package low.provider;

import java.net.URI;

import javax.servlet.http.HttpServletRequest;

import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.servlet.RequestScoped;

@RequestScoped
public class GameKeyProvider implements Provider<String> {

	private final Provider<HttpServletRequest> requestProvider;
	
	@Inject
	public GameKeyProvider(Provider<HttpServletRequest> requestProvider) {
		this.requestProvider = requestProvider;
	}
	
	@Override
	public String get() {
		HttpServletRequest req = requestProvider.get();
		URI uri = URI.create(req.getRequestURI());
		String[] pathParts = uri.getPath().split("/");
		// Path is something like /game/1234 which would be ["","game","1234"]
		if (pathParts.length > 2) {
			String gameKey = pathParts[2];
			if (gameKey != null && !gameKey.isEmpty()) {
				return gameKey;
			}
		}
		return null;
	}
}
