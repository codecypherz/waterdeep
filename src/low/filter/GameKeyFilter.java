package low.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

import low.annotation.GameKey;
import low.servlet.HttpResponseCode;

import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.Singleton;

/**
 * Filters game requests that don't have a game key in the path.
 */
@Singleton
public class GameKeyFilter implements Filter {

	private final @GameKey Provider<String> gameKeyProvider;
	
	@Inject
	public GameKeyFilter(@GameKey Provider<String> gameKeyProvider) {
		this.gameKeyProvider = gameKeyProvider;
	}
	
	@Override
	public void doFilter(
			ServletRequest servletReq, ServletResponse servletRes, FilterChain chain)
			throws IOException, ServletException {
		
		HttpServletResponse res = (HttpServletResponse) servletRes;
		
		String gameKey = gameKeyProvider.get();
		if (gameKey == null) {
			res.sendError(HttpResponseCode.BAD_REQUEST.getCode());
			return;
		}
		chain.doFilter(servletReq, servletRes);
	}
	
	@Override
	public void init(FilterConfig arg0) throws ServletException {
	}
	
	@Override
	public void destroy() {
	};
}
