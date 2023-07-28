import { Component } from '@angular/core';
import { ThemeColorService } from './services/theme-color.service';
import { DbService } from './services/db.service';

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

  constructor(
    private themeColorService: ThemeColorService,
    private dbService: DbService
  ) {
    this.showSplashScreen();
    this.themeColorService.setCssVariables('#1677ff');
    this.initializeApp();
  }

  initializeApp() {
    this.dbService.initializePlugin().then(async () => {
      console.log('>>>> initializePlugin');
      await customElements.whenDefined('jeep-sqlite');
      const jeepSqliteEl = document.querySelector('jeep-sqlite');
      if (jeepSqliteEl != null) {
        // this.dbService.init();
        console.log(`>>>> isStoreOpen ${await jeepSqliteEl.isStoreOpen()}`);
      } else {
        console.log('>>>> jeepSqliteEl is null');
      }
    });
    this.dbService.state.subscribe((state) => {
      if (state.ready) {
        this.loadSessions();
      }
    });
  }

  private loadSessions() {
    this.dbService.db?.query('SELECT * FROM session').then((res) => {
      console.log('res', res);
    });
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
