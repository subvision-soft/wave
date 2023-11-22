import { Component, HostBinding, isDevMode } from '@angular/core';
import { ThemeColorService } from './services/theme-color.service';
import { fadeAnimation } from './utils/animations';
import { TranslateService } from '@ngx-translate/core';
import { ParametersService } from './services/parameters.service';
import { jamJoystick } from '@ng-icons/jam-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation],
})
export class AppComponent {
  title = 'wave';
  @HostBinding('class.backgroundStep-1') backgroundStep1: boolean = true;
  @HostBinding('class.backgroundStep-2') backgroundStep2: boolean = true;
  tabs = [
    { icon: 'jamHomeF', label: 'Accueil', link: '/home' },
    { icon: 'jamCameraF', label: 'Caméra', link: '/camera' },
    { icon: 'jamFolderF', label: 'Sessions', link: '/sessions' },
    { icon: 'jamCogF', label: 'Paramètres', link: '/settings' },
  ];
  cssVariables: string = '';

  constructor(
    private themeColorService: ThemeColorService,
    private translate: TranslateService,
    private parametersService: ParametersService
  ) {
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
    this.themeColorService.setCssVariables('#1677ff');
    let langs = ['en', 'fr', 'es', 'it'];
    this.translate.addLangs(langs);
    this.translate.setDefaultLang('fr');
    const browserLang = translate.getBrowserLang() || 'fr';
    this.translate.use(langs.includes(browserLang) ? browserLang : 'fr');
  }
}
