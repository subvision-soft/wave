import { Component, HostBinding } from '@angular/core';
import { ThemeColorService } from './services/theme-color.service';
import { fadeAnimation } from './utils/animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation],
})
export class AppComponent {
  title = 'wave';
  private initPlugin: boolean = false;
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
    private translate: TranslateService
  ) {
    this.themeColorService.setCssVariables('#1677ff');
    translate.addLangs(['en', 'fr', 'es', 'it', 'ar-KW', 'ar-DZ']);
    translate.setDefaultLang('en');
    const browserLang = 'en';
    translate.use(
      browserLang.match(/en|fr|es|it|ar-KW|ar-DZ/) ? browserLang : 'en'
    );
  }

  tabSelected(tab: any) {
    this.title = tab.label;
    this.backgroundStep1 = tab.label === 'Accueil';
    this.backgroundStep2 = tab.label === 'Paramètres';
  }
}
