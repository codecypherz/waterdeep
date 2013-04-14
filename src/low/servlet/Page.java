package low.servlet;

import low.Config;

/**
 * Enum describing page meta-data.
 */
public enum Page {

	HOME("home.html", "low.js", "low.css");
	
	private final String htmlFilePath;
	private final String jsFilePath;
	private final String cssFilePath;

	private Page(String htmlFileName, String jsFileName, String cssFileName) {
		this.htmlFilePath = htmlFileName;
		this.jsFilePath = "/generated/" + jsFileName + "?v=" + Config.VERSION;
		this.cssFilePath = "/generated/" + cssFileName + "?v=" + Config.VERSION;
	}
	
	public String getHtmlFilePath(boolean isDev) {
		return isDev ? "dev-" + htmlFilePath : htmlFilePath;
	}
	
	public String getJsFilePath() {
		return jsFilePath;
	}
	
	public String getCssFilePath() {
		return cssFilePath;
	}
}
