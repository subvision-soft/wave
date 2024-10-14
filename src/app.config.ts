import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgIconsModule } from '@ng-icons/core';
import {
  iconoirBinMinus,
  iconoirCamera,
  iconoirCancel,
  iconoirCheck,
  iconoirCopy,
  iconoirDashboardDots,
  iconoirHomeSimpleDoor,
  iconoirMediaImage,
  iconoirNavArrowDown,
  iconoirNavArrowLeft,
  iconoirOnePointCircle,
  iconoirPasteClipboard,
  iconoirSaveFloppyDisk,
  iconoirSettings,
  iconoirTimer,
} from '@ng-icons/iconoir';
import { bootstrapHouseFill } from '@ng-icons/bootstrap-icons';
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

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

export const appConfig: ApplicationConfig = {
  providers: [
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
        iconoirBinMinus,
        iconoirOnePointCircle,
        iconoirMediaImage,
        iconoirPasteClipboard,
        iconoirSaveFloppyDisk,
        iconoirCancel,
        bootstrapHouseFill,
        jamCameraF,
        jamSignal,
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
    provideAnimations(),
    provideHttpClient(),
  ],
};
