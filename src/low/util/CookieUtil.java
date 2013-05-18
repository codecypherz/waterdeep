package low.util;

import java.util.logging.Logger;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import low.annotation.ClientId;

import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.Singleton;

@Singleton
public class CookieUtil {
	
	private static final Logger logger = Logger.getLogger(CookieUtil.class.getName());
	
	public enum CookieName {
		CLIENT_ID
	}
	
	private final Provider<HttpServletResponse> responseProvider;
	private final Provider<String> clientIdProvider;
	
	@Inject
	public CookieUtil(
			Provider<HttpServletResponse> responseProvider,
			@ClientId Provider<String> clientIdProvider) {
		this.responseProvider = responseProvider;
		this.clientIdProvider = clientIdProvider;
	}
	
	public void setClientId() {
		HttpServletResponse res = responseProvider.get();
		String clientId = clientIdProvider.get();
		logger.info("Adding " + clientId + " as a cookie to the response.");
		Cookie cookie = new Cookie(CookieName.CLIENT_ID.name(), clientId);
		cookie.setPath("/");
		res.addCookie(cookie);
	}
}
