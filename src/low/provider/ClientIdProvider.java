package low.provider;

import java.util.logging.Logger;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import low.util.CookieUtil.CookieName;

import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.servlet.RequestScoped;

@RequestScoped
public class ClientIdProvider implements Provider<String> {

	private static final Logger logger = Logger.getLogger(ClientIdProvider.class.getName());
	
	private final Provider<HttpServletRequest> requestProvider;
	private String clientId;
	
	@Inject
	public ClientIdProvider(Provider<HttpServletRequest> requestProvider) {
		this.requestProvider = requestProvider;
		this.clientId = null;
	}
	
	@Override
	public String get() {
		
		// Always return the same client ID if it has been set.  This allows the
		// generated ID to be reused within the request scope without it being
		// regenerated.  If the generated client ID is not set on the response
		// for this request, then a new client ID will be generated for the next
		// request.
		if (clientId != null) {
			return clientId;
		}
		
		// Look for the client ID in the request.
		HttpServletRequest req = requestProvider.get();
		Cookie[] cookies = req.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equalsIgnoreCase(CookieName.CLIENT_ID.name())) {
					clientId = cookie.getValue();
					logger.info("Found this client ID in the request: " + clientId);
					return clientId;
				}
			}
		}
		
		// Not found in the request, so generate one.
		clientId = java.util.UUID.randomUUID().toString();
		logger.info("Generating this client ID: " + clientId);
		return clientId;
	}
}
