import { Component, HostBinding } from '@angular/core';
import { ThemeColorService } from './services/theme-color.service';
import { fadeAnimation } from './utils/animations';
import { ParametersService } from './services/parameters.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation],
})
export class AppComponent {
  title = 'subapp';
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
    private parametersService: ParametersService
  ) {
    this.themeColorService.setCssVariables('#1677ff');
  }

  tabSelected(tab: any) {
    this.title = tab.label;
    this.backgroundStep1 = tab.label === 'Accueil';
    this.backgroundStep2 = tab.label === 'Paramètres';
  }
}
