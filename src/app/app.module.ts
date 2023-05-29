import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import {
  iconoirBinMinus,
  iconoirCamera,
  iconoirCopy,
  iconoirDashboardDots,
  iconoirHomeSimpleDoor,
  iconoirMediaImage,
  iconoirNavArrowLeft,
  iconoirOnePointCircle,
  iconoirSettings,
  iconoirTimer,
} from '@ng-icons/iconoir';
import { NgIconsModule } from '@ng-icons/core';
import { TabBarButtonComponent } from './tab-bar-button/tab-bar-button.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { CameraComponent } from './camera/camera.component';
import { HeaderComponent } from './header/header.component';
import { IconButtonComponent } from './icon-button/icon-button.component';
import { NgxOpenCVModule } from '../lib/ngx-opencv.module';
import { OpenCVConfig } from '../lib/models';
import { LoadingComponent } from './loading/loading.component';
import { ResultComponent } from './result/result.component';
import { CameraPreviewComponent } from './camera-preview/camera-preview.component';
import { SegmentedButtonComponent } from './segmented-button/segmented-button.component';
import { TextfieldComponent } from './textfield/textfield.component';
import { NumberSpinnerComponent } from './number-spinner/number-spinner.component';
import { SlideSheetComponent } from './slide-sheet/slide-sheet.component';
import { ChronoPickerComponent } from './chrono-picker/chrono-picker.component';
import { ImpactsListComponent } from './impacts-list/impacts-list.component';
import { TargetPreviewComponent } from './target-preview/target-preview.component';
import { ButtonComponent } from './button/button.component';

const openCVConfig: OpenCVConfig = {
  openCVDirPath: 'assets/opencv',
};

@NgModule({
  declarations: [
    AppComponent,
    TabBarComponent,
    TabBarButtonComponent,
    SettingsComponent,
    HomeComponent,
    CameraComponent,
    HeaderComponent,
    IconButtonComponent,
    LoadingComponent,
    ResultComponent,
    CameraPreviewComponent,
    SegmentedButtonComponent,
    TextfieldComponent,
    NumberSpinnerComponent,
    SlideSheetComponent,
    ChronoPickerComponent,
    ImpactsListComponent,
    TargetPreviewComponent,
    ButtonComponent,
  ],
  imports: [
    NgxOpenCVModule.forRoot(openCVConfig),
    BrowserModule,
    AppRoutingModule,
    NgIconsModule.withIcons({
      iconoirHomeSimpleDoor,
      iconoirCamera,
      iconoirSettings,
      iconoirNavArrowLeft,
      iconoirDashboardDots,
      iconoirTimer,
      iconoirCopy,
      iconoirBinMinus,
      iconoirOnePointCircle,
      iconoirMediaImage,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    window.screen.orientation.lock('portrait');
  }
}
