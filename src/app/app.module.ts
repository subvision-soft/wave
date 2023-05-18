import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import {
  iconoirHome,
  iconoirCamera,
  iconoirSettings,
  iconoirNavArrowLeft,
} from '@ng-icons/iconoir';
import { NgIconsModule } from '@ng-icons/core';
import { TabBarButtonComponent } from './tab-bar-button/tab-bar-button.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { CameraComponent } from './camera/camera.component';
import { HeaderComponent } from './header/header.component';
import { IconButtonComponent } from './icon-button/icon-button.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgIconsModule.withIcons({
      iconoirHome,
      iconoirCamera,
      iconoirSettings,
      iconoirNavArrowLeft,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
