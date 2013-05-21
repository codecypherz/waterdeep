package low.service;

import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.inject.Singleton;

@Singleton
public class KeyService {

	private static final Logger logger = Logger.getLogger(KeyService.class.getName());
	
	/**
	 * Gets a Key object from the string representation but does so without
	 * throwing an exception.  If the key is invalid in some way, then null is
	 * returned.
	 * @param stringKey The string representation of the key.
	 * @return The Key object, if the string key was valid.
	 */
	public Key getKey(String stringKey) {
		try {
			return KeyFactory.stringToKey(stringKey);
		} catch (IllegalArgumentException e) {
			logger.log(Level.SEVERE, "Invalid key: " + stringKey, e);
			return null;
		}
	}
}
