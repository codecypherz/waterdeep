package low.filter;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import low.CookieName;
import low.annotation.ClientId;

import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.Singleton;

/**
 * Ensures all responses contain the client ID that was set in the request or a
 * newly generated client ID if one didn't exist.
 */
@Singleton
public class ClientIdFilter implements Filter {
	
	private static final Logger logger = Logger.getLogger(ClientIdFilter.class.getName());
	
	private final @ClientId Provider<String> clientIdProvider;
	
	@Inject
	public ClientIdFilter(@ClientId Provider<String> clientIdProvider) {
		this.clientIdProvider = clientIdProvider;
	}
	
	@Override
	public void doFilter(
			ServletRequest servletReq, ServletResponse servletRes, FilterChain chain)
			throws IOException, ServletException {
		
		HttpServletResponse res = (HttpServletResponse) servletRes;
		
		String clientId = clientIdProvider.get();
		logger.info("Adding " + clientId + " as a cookie to the response.");
		Cookie cookie = new Cookie(CookieName.CLIENT_ID.name(), clientId);
		cookie.setPath("/");
		res.addCookie(cookie);
		
		chain.doFilter(servletReq, servletRes);
	}
	
	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}
	
	@Override
	public void destroy() {
	};
}
