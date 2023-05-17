import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import {iconoirHome, iconoirCamera, iconoirSettings} from '@ng-icons/iconoir';
import {NgIconsModule} from "@ng-icons/core";
import { TabBarButtonComponent } from './tab-bar-button/tab-bar-button.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { CameraComponent } from './camera/camera.component';

@NgModule({
  declarations: [
    AppComponent,
    TabBarComponent,
    TabBarButtonComponent,
    SettingsComponent,
    HomeComponent,
    CameraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgIconsModule.withIcons({ iconoirHome,iconoirCamera,iconoirSettings })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
