import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import { iconoirHome,iconoirCamera } from '@ng-icons/iconoir';
import {NgIconsModule} from "@ng-icons/core";
import { TabBarButtonComponent } from './tab-bar-button/tab-bar-button.component';

@NgModule({
  declarations: [
    AppComponent,
    TabBarComponent,
    TabBarButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgIconsModule.withIcons({ iconoirHome,iconoirCamera })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
