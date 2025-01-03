import {Component, computed, HostBinding, isDevMode, signal} from '@angular/core';
import {fadeAnimation} from './utils/animations';
import {TranslateService} from '@ngx-translate/core';
import {ParametersService} from './services/parameters.service';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {AppSettings} from './utils/AppSettings';
import {ToastComponent} from './components/toast/toast.component';
import {TabBarComponent} from './components/tab-bar/tab-bar.component';
import {HttpClient} from '@angular/common/http';
import {SplashScreenComponent} from './components/splash-screen/splash-screen.component';
import {NgIf} from '@angular/common';
import {EndpointsUtils} from './utils/EndpointsUtils';
import {ContainerComponent} from './components/container/container.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation],
  standalone: true,
  providers: [TranslateService],
  imports: [RouterOutlet, ToastComponent, TabBarComponent, SplashScreenComponent, NgIf, ContainerComponent],
})
export class AppComponent {
  title = 'wave';
  @HostBinding('style.background-color') backgroundColor: string =
    'var(--color-background-2)';
  tabs: any[] = [];
  cssVariables: string = '';
  settingsLoaded = signal(false);
  visionTokenRetrieved = signal(true);

  showSplashScreen = computed(() => {
      return !this.settingsLoaded() || !this.visionTokenRetrieved();
    }
  );

  constructor(
    private translate: TranslateService,
    private parametersService: ParametersService,
    private router: Router,
    private http: HttpClient
  ) {
    this.parametersService.loaded.subscribe((loaded: boolean) => {
      this.settingsLoaded.set(loaded);
      if (loaded) {
        this.http.get(EndpointsUtils.getPathGenToken()).subscribe((res: any) => {
            localStorage.setItem('token', res?.token);
            this.visionTokenRetrieved.set(true);
          }
        )
      }

    });


    router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        if (ev.urlAfterRedirects.includes('camera/preview')) {
          this.backgroundColor = 'transparent';
        } else {
          this.backgroundColor = 'var(--color-background-2)';
        }
      }
    });
    this.initTabs();
    let langs = ['en-UK', 'fr-FR', 'es-ES', 'it-IT'];
    this.translate.addLangs(langs);
    this.translate.setDefaultLang('fr-FR');
    const browserLang = translate.getBrowserLang() || 'fr-FR';
    this.translate.use(langs.includes(browserLang) ? browserLang : 'fr-FR');
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
}
