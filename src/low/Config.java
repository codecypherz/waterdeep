package low;

import java.nio.charset.Charset;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;

public class Config {
	
	/**
	 * The version of the application which is used to bust the cache for the
	 * JS/CSS bundles.
	 */
	public static final String VERSION = "0.02";
	
	/**
	 * The URL parameters to the application.
	 */
	public enum UrlParameter {
		MODE         // The mode (such as "raw" for development)
	}
	
	/**
	 * The various modes of the application.
	 */
	public enum Mode {
		NORMAL,
		RAW
	}
	
	/**
	 * Things replaced in HTML files.
	 */
	public enum HtmlParameter {
		CSS_FILE_PATH,
		JS_FILE_PATH
	}
	
	/**
	 * The UTF_8 charset.
	 */
	private static Charset UTF_8 = Charset.forName("UTF-8");
	
	/**
	 * Determines if the request is asking for raw mode or not.
	 * @param req The request to check.
	 * @return True if in raw mode, false otherwise.
	 */
	public static boolean isRawMode(HttpServletRequest req) {
		return getMode(req) == Mode.RAW;
	}
	
	/**
	 * Gets the mode from the request.
	 * @param req The request.
	 * @return The mode in the request or null if it couldn't be parsed.
	 */
	public static Mode getMode(HttpServletRequest req) {
		String m = getParam(req, UrlParameter.MODE);
		if (m != null) {
			try {
				return Mode.valueOf(m.toUpperCase());
			} catch (Exception e) {
				return null;
			}
		}
		return null;
	}
	
	/**
	 * Gets the desired parameter from the request object.
	 * @param req The HTTP servlet request.
	 * @param param The parameter to retrieve.
	 * @return The parameter or null if there was none.
	 */
	public static String getParam(HttpServletRequest req, UrlParameter param) {

		// There is a bug when dealing with Firefox (doesn't happen with Chrome
		// for some reason).  You cannot call both req.getParameter() AND
		// req.getReader() without getting an exception.  This is used whenever
		// JSON is posted to a servlet, so to get around this, the method here
		// will parse the raw query string instead of using req.getParameter.
		//
		// See this for more detail on the bug - there might be another fix:
		// http://jira.codehaus.org/browse/JETTY-477
		// and
		// http://jira.codehaus.org/browse/JETTY-1291

		List<NameValuePair> pairs = URLEncodedUtils.parse(
				req.getQueryString(), UTF_8);

		for (NameValuePair pair : pairs) {
			if (pair.getName().equalsIgnoreCase(param.toString())) {
				String value = pair.getValue();
				if (value != null) {
					return value.trim();
				}
			}
		}
		return null;
	}
}
