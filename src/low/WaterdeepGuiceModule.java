package low;

import com.google.code.twig.ObjectDatastore;
import com.google.code.twig.annotation.AnnotationObjectDatastore;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.servlet.RequestScoped;

public class WaterdeepGuiceModule extends AbstractModule {

	@Override
	protected void configure() {
		// Bind things here.
	}
	
	@Provides @RequestScoped
	private ObjectDatastore provideObjectDatastore() {
		return new AnnotationObjectDatastore(
				false /* Not indexed by default */);
	}
}
