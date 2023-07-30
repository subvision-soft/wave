import { Component } from '@angular/core';
import { ThemeColorService } from './services/theme-color.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'subapp';
  tabs = [
    { icon: 'iconoirHomeSimpleDoor', label: 'Accueil', link: '/home' },
    { icon: 'iconoirCamera', label: 'Caméra', link: '/camera' },
    { icon: 'iconoirDashboardDots', label: 'Paramètres', link: '/settings' },
  ];
  cssVariables: string = '';
  private initPlugin: boolean = false;

  constructor(private themeColorService: ThemeColorService) {
    this.showSplashScreen();
    this.themeColorService.setCssVariables('#1677ff');
  }

  private async showSplashScreen() {
    console.log('showSplashScreen');
    const lottie = (window as any).lottie;
    await lottie.splashscreen.hide();
    await lottie.splashscreen.show('public/assets/subapp.json', false);
  }

  tabSelected(tab: any) {
    this.title = tab.label;
  }
}
