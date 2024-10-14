import {ApplicationConfig, importProvidersFrom, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideServiceWorker} from '@angular/service-worker';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, provideHttpClient} from '@angular/common/http';
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

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}),
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
        jamClose,
      }),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })]
};
