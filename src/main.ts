/**
 * Import Angular libraries.
 */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

/**
 * Import custom modules.
 */
import { AppModule } from './app/app.module';

/**
 * Import environments.
 */
import { environment } from './environments/environment';

// Enable production mode for the production
if (environment.production) {
  enableProdMode();
}

// Let's bootstrap the module
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
