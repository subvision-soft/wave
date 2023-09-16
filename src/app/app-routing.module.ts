import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ColorPreviewComponent } from './pages/color-preview/color-preview.component';
import { CameraPreviewComponent } from './pages/camera-preview/camera-preview.component';
import { ResultComponent } from './pages/result/result.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SessionsComponent } from './pages/sessions/sessions.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'color',
    component: ColorPreviewComponent,
  },
  {
    path: 'camera',
    children: [
      {
        path: '',
        redirectTo: 'preview',
        pathMatch: 'full',
      },
      {
        path: 'preview',
        component: CameraPreviewComponent,
      },
      {
        path: 'result',
        component: ResultComponent,
      },
    ],
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'sessions',
    component: SessionsComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
