import { Component, HostBinding } from '@angular/core';
import { ThemeColorService } from './services/theme-color.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'subapp';
  @HostBinding('class.backgroundStep-1') backgroundStep1: boolean = true;
  @HostBinding('class.backgroundStep-2') backgroundStep2: boolean = true;
  tabs = [
    { icon: 'iconoirHomeSimpleDoor', label: 'Accueil', link: '/home' },
    { icon: 'iconoirCamera', label: 'Caméra', link: '/camera' },
    { icon: 'iconoirDashboardDots', label: 'Paramètres', link: '/settings' },
  ];
  cssVariables: string = '';

  constructor(private themeColorService: ThemeColorService) {
    this.showSplashScreen();
    this.themeColorService.setCssVariables('#1cd29b');
  }

  private async showSplashScreen() {
    console.log('showSplashScreen');
    const lottie = (window as any).lottie;
    await lottie.splashscreen.hide();
    await lottie.splashscreen.show('public/assets/subapp.json', false);
  }

  tabSelected(tab: any) {
    this.title = tab.label;
    this.backgroundStep1 = tab.label === 'Accueil';
    this.backgroundStep2 = tab.label === 'Paramètres';
  }
}
