import { Routes } from '@angular/router';
import { HomeComponent } from './app/pages/home/home.component';
import { CameraPreviewComponent } from './app/pages/camera-preview/camera-preview.component';
import { ResultComponent } from './app/pages/result/result.component';
import { SavingComponent } from './app/pages/saving/saving.component';
import { CvComponent } from './app/pages/playground/cv/cv.component';
import { SettingsComponent } from './app/pages/settings/settings.component';
import { SessionsComponent } from './app/pages/sessions/sessions.component';
import { SessionComponent } from './app/pages/session/session.component';
import { UsersComponent } from './app/pages/users/users.component';
import { UserComponent } from './app/pages/user/user.component';
import { TargetsComponent } from './app/pages/targets/targets.component';
import { TeamsComponent } from './app/pages/teams/teams.component';
import { ScanServerComponent } from './app/pages/scan-server/scan-server.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
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
        data: { transparentBackground: true },
      },
      {
        path: 'result',
        component: ResultComponent,
      },
      {
        path: 'saving',
        component: SavingComponent,
      },
    ],
  },
  {
    path: 'playground',
    children: [
      {
        path: '',
        redirectTo: 'cv',
        pathMatch: 'full',
      },
      {
        path: 'cv',
        component: CvComponent,
      },
    ],
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'sessions',
    children: [
      {
        path: '',
        component: SessionsComponent,
      },
      {
        path: 'session',
        component: SessionComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'targets',
        component: TargetsComponent,
      },
      {
        path: 'teams',
        component: TeamsComponent,
      },
    ],
  },
  {
    path: 'server-connect',
    component: ScanServerComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
