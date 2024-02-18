import { Component, HostBinding, isDevMode } from '@angular/core';
import { fadeAnimation } from './utils/animations';
import { TranslateService } from '@ngx-translate/core';
import { ParametersService } from './services/parameters.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation],
})
export class AppComponent {
  title = 'wave';
  @HostBinding('style.background-color') backgroundColor: string =
    'var(--color-background-1)';
  tabs = [
    { icon: 'jamHomeF', label: 'Accueil', link: '/home' },
    { icon: 'jamCameraF', label: 'Caméra', link: '/camera' },
    { icon: 'jamFolderF', label: 'Sessions', link: '/sessions' },
    { icon: 'jamCogF', label: 'Paramètres', link: '/settings' },
  ];
  cssVariables: string = '';

  constructor(
    private translate: TranslateService,
    private parametersService: ParametersService,
    private router: Router
  ) {
    router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        if (ev.urlAfterRedirects.includes('camera/preview')) {
          this.backgroundColor = 'transparent';
        } else {
          this.backgroundColor = 'var(--color-background-1)';
        }
      }
    });
    if (isDevMode()) {
      this.tabs = [
        {
          icon: 'jamJoystick',
          label: 'Playground',
          link: '/playground',
        },
        ...this.tabs,
      ];
    }
    let langs = ['en', 'fr', 'es', 'it'];
    this.translate.addLangs(langs);
    this.translate.setDefaultLang('fr');
    const browserLang = translate.getBrowserLang() || 'fr';
    this.translate.use(langs.includes(browserLang) ? browserLang : 'fr');
  }
}
