package low.servlet;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.CharBuffer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import low.Config;
import low.Config.HtmlParameter;

public class PageWriter {

	private static PageWriter instance;

	public static PageWriter getInstance() {
		if (instance == null) {
			instance = new PageWriter();
		}
		return instance;
	}
	
	/**
	 * Writes a standard web page back to the client.
	 * @param req The request.
	 * @param resp The response.
	 * @param page The page to write.
	 * @throws FileNotFoundException Thrown when any of the paths are wrong.
	 * @throws IOException Thrown if any of the files can't be read.
	 */
	public void write(HttpServletRequest req, HttpServletResponse resp, Page page)
	throws FileNotFoundException, IOException {

		boolean rawMode = Config.isRawMode(req);

		// Get the HTML path.
		String htmlPath = page.getHtmlFilePath(rawMode == true);

		// Read in the HTML.
		FileReader reader = new FileReader(htmlPath);
	    CharBuffer buffer = CharBuffer.allocate(16384);
	    reader.read(buffer);
	    reader.close();
		String html = new String(buffer.array());

		if (rawMode != true) {
			html = replaceParam(html, HtmlParameter.JS_FILE_PATH, page.getJsFilePath());
		}
		html = replaceParam(html, HtmlParameter.CSS_FILE_PATH, page.getCssFilePath());
		
	    resp.setContentType("text/html");
	    resp.getWriter().write(html);
	}
	
	/**
	 * Replaces the parameter in the given HTML string with the value.
	 * @param html The HTML that needs to replace the key with the value.
	 * @param parameter The parameter to replace.
	 * @param value The value with which to replace the parameter.
	 * @return
	 */
	private String replaceParam(String html, HtmlParameter parameter, String value) {
		return html.replaceAll(
				"\\{\\{ " + parameter.toString() + " \\}\\}", value);
	}
}
