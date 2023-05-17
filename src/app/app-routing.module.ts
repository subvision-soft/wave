import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {CameraComponent} from "./camera/camera.component";
import {SettingsComponent} from "./settings/settings.component";

const routes: Routes = [
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'camera',
    component:CameraComponent
  },
  {
    path:'settings',
    component:SettingsComponent
  },
  {
    path:'',
    redirectTo:'/home',
    pathMatch:'full'
  },{
    path:'**',
    redirectTo:'/home',
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
