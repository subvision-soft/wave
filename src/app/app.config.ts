import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  LOCALE_ID,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideServiceWorker} from '@angular/service-worker';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideAnimations} from '@angular/platform-browser/animations';
import {
  jamArrowDown,
  jamArrowLeft,
  jamArrowUp,
  jamCameraF,
  jamCheck,
  jamChevronLeft,
  jamChevronRight,
  jamClose,
  jamCogF,
  jamFolder,
  jamFolderF,
  jamFolderOpen,
  jamGhost,
  jamHomeF,
  jamJoystick,
  jamMoreVerticalF,
  jamPlus,
  jamSearch,
  jamSignal,
} from '@ng-icons/jam-icons';
import {
  iconoirCamera,
  iconoirCheck,
  iconoirCopy,
  iconoirDashboardDots,
  iconoirHomeSimpleDoor,
  iconoirMediaImage,
  iconoirNavArrowDown,
  iconoirNavArrowLeft,
  iconoirOnePointCircle,
  iconoirPasteClipboard,
  iconoirSettings,
  iconoirTimer,
} from '@ng-icons/iconoir';
import {NgIconsModule} from '@ng-icons/core';
import {authInterceptor} from '../auth/auth.interceptor';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';

import localeIt from '@angular/common/locales/it';
import localeEs from '@angular/common/locales/es';
import {LocaleService} from './services/locale.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

registerLocaleData(localeFr)
registerLocaleData(localeEn)
registerLocaleData(localeIt)
registerLocaleData(localeEs)

export function localeFactory(localeService: LocaleService): string {
  return localeService.locale; // Directly return the string, not an Observable
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    {
      provide: LOCALE_ID,
      useFactory: localeFactory,
      deps: [LocaleService] // Ensure it depends on LocaleService
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (localeService: LocaleService) => () => localeService.locale,
      deps: [LocaleService],
      multi: true
    },
    importProvidersFrom(
      NgIconsModule.withIcons({
        iconoirHomeSimpleDoor,
        iconoirCamera,
        iconoirSettings,
        iconoirNavArrowLeft,
        iconoirNavArrowDown,

        iconoirDashboardDots,
        iconoirTimer,
        iconoirCheck,
        iconoirCopy,
        iconoirOnePointCircle,
        iconoirMediaImage,
        iconoirPasteClipboard,
        jamCameraF,
        jamCogF,
        jamHomeF,
        jamFolderF,
        jamArrowUp,
        jamArrowDown,
        jamArrowLeft,
        jamGhost,
        jamCheck,
        jamJoystick,
        jamFolder,
        jamFolderOpen,
        jamChevronRight,
        jamChevronLeft,
        jamSearch,
        jamMoreVerticalF,
        jamPlus,
        jamSignal,
        jamClose,
      }),


      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })]
};
