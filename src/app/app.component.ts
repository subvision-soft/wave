import {Component, HostBinding, isDevMode, OnInit} from '@angular/core';
import {fadeAnimation} from './utils/animations';
import {TranslateService} from '@ngx-translate/core';
import {ParametersService} from './services/parameters.service';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {AppSettings} from './utils/AppSettings';
import {ToastComponent} from './components/toast/toast.component';
import {TabBarComponent} from './components/tab-bar/tab-bar.component';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation],
  standalone: true,
  providers: [TranslateService],
  imports: [RouterOutlet, ToastComponent, TabBarComponent],
})
export class AppComponent implements OnInit {
  title = 'wave';
  @HostBinding('style.background-color') backgroundColor: string =
    'var(--color-background-1)';
  tabs: any[] = [];
  cssVariables: string = '';

  constructor(
    private translate: TranslateService,
    private parametersService: ParametersService,
    private router: Router,
    private http: HttpClient
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
        ? {icon: 'jamJoystick', label: 'Playground', link: '/playground'}
        : undefined,
      {icon: 'jamHomeF', label: 'Accueil', link: '/home'},
      {icon: 'jamCameraF', label: 'Caméra', link: '/camera'},
      AppSettings.ENABLE_LOCAL_SAVE
        ? {icon: 'jamFolderF', label: 'Sessions', link: '/sessions'}
        : undefined,
      {icon: 'jamCogF', label: 'Paramètres', link: '/settings'},
    ].filter((tab) => !!tab);
  }

  ngOnInit(): void {
    this.http.get('https://wave-api-6rqq.onrender.com/generate-token').subscribe((res) => {
      console.log('token', res);
    })
  }
}
