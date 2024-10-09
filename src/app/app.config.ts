import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideServiceWorker} from '@angular/service-worker';
import {HttpClient, provideHttpClient} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

// required for AoT
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const appConfig: ApplicationConfig = {

  providers: [
    importProvidersFrom([BrowserAnimationsModule]),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }).providers!,
    provideHttpClient(),
    provideRouter(routes), provideClientHydration(), provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })]
};
