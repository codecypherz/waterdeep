package low;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

/**
 * Encapsulates the PersistenceManagerFactory and exposes a singleton getter.
 */
public class PMF {

	// Instantiate the singleton.
	private static final PersistenceManagerFactory PMF_INSTANCE =
			JDOHelper.getPersistenceManagerFactory("transactions-optional");

	// No state is kept by this wrapper class.
	private PMF() { }

	// Return the singleton.
	public static PersistenceManagerFactory get() {
		return PMF_INSTANCE;
	}
}
