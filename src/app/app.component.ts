import { Component, HostBinding, isDevMode } from '@angular/core';
import { fadeAnimation } from './utils/animations';
import { TranslateService } from '@ngx-translate/core';
import { ParametersService } from './services/parameters.service';
import { NavigationEnd, Router } from '@angular/router';
import { AppSettings } from './utils/AppSettings';

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
  tabs: any[] = [];
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
    this.initTabs();
    let langs = ['en', 'fr', 'es', 'it'];
    this.translate.addLangs(langs);
    this.translate.setDefaultLang('fr');
    const browserLang = translate.getBrowserLang() || 'fr';
    this.translate.use(langs.includes(browserLang) ? browserLang : 'fr');
  }

  initTabs() {
    this.tabs = [
      isDevMode()
        ? { icon: 'jamJoystick', label: 'Playground', link: '/playground' }
        : undefined,
      { icon: 'jamHomeF', label: 'Accueil', link: '/home' },
      { icon: 'jamCameraF', label: 'Caméra', link: '/camera' },
      AppSettings.ENABLE_LOCAL_SAVE
        ? { icon: 'jamFolderF', label: 'Sessions', link: '/sessions' }
        : undefined,
      { icon: 'jamCogF', label: 'Paramètres', link: '/settings' },
    ].filter((tab) => !!tab);
  }
}
