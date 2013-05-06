package low.servlet;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.inject.Singleton;

@Singleton
public class HomeServlet extends HttpServlet {

	private static final long serialVersionUID = 3019354499979471833L;
	
	UserService userService = UserServiceFactory.getUserService();

	/**
	 * This is request for the application.
	 */
	public void doGet(HttpServletRequest req, HttpServletResponse res)
			throws IOException {

		PageWriter.getInstance().write(req, res, Page.HOME);
	}
}