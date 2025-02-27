import {Injectable} from '@angular/core';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {ToastService, ToastTypes} from './toast.service';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {ServerService} from './server.service';
import {LocaleService} from './locale.service';

@Injectable({
  providedIn: 'root',
})
export class ParametersService {
  public loaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public static readonly langs: string[] = ['en-UK', 'fr-FR', 'es-ES', 'it-IT']

  private toUpdate: string[] = [];

  get parameters(): any {
    return ParametersService._parameters;
  }

  set parameters(value: any) {
    ParametersService._parameters = value;
    const parameters = Object.keys(ParametersService._parameters).map((key) => {
      return {
        key: key,
        value: ParametersService._parameters[key].value,
      };
    });
    Filesystem.writeFile({
      path: 'parameters.json',
      data: btoa(JSON.stringify(parameters)),
      directory: Directory.Data,
    }).then(() => {
      this.reload();
      this.toastService.initiate({
        title: 'SETTINGS.TOASTS.SAVED_SUCCESS.TITLE',
        content: 'SETTINGS.TOASTS.SAVED_SUCCESS.MESSAGE',
        show: true,
        type: ToastTypes.SUCCESS,
        duration: 2000,
      });
    });
  }

  private static _parameters: any = {
    URL_API: {
      value: '',
      update: function (value: any, scope: any) {
        scope.serverService.connect(value);
      },
    }, URL_API2: {
      value: 'https://subvision.crobix.ovh',
      update: function (value: any, scope: any) {
      },
    },
    VALID_SHEET_BEFORE_PROCESS: {
      value: 5,
      update: function (value: any) {
      },
    },
    COULEUR_PRINCIPALE: {
      value: '#a5c8d5',
      update: function (value: any) {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', value);
      },
    },
    COULEUR_SECONDAIRE: {
      value: '#e9ca7c',
      update: function (value: any) {
        const root = document.documentElement;
        root.style.setProperty('--color-secondary', value);
      },
    },
    RAYON_BORDURES: {
      value: 20,
      update: function (value: any) {
        const root = document.documentElement;
        root.style.setProperty('--border-radius', value + 'px');
      },
    },
    TAILLE_POLICE: {
      value: 20,
      update: function (value: any) {
        const root = document.documentElement;
        root.style.setProperty('--font-size', value + 'px');
      },
    },
    TAILLE_ESPACES: {
      value: 20,
      update: function (value: any) {
        const root = document.documentElement;
        root.style.setProperty('--padding', value + 'px');
      },
    },
    EMPLACEMENT_DONNEES: {
      value: '/subapp/data',
      update: function (value: any) {
      },
    },
    THEME_SOMBRE: {
      value: 'false',
      update: function (value: any) {
        const style = document.documentElement.style;
        style.setProperty(
          '--theme-color-1',
          value === 'true' ? 'var(--dark)' : '#ffffff'
        );
        style.setProperty(
          '--theme-color-2',
          value === 'true' ? '#ffffff' : 'var(--dark)'
        );
      },
    },
    LANGUE: {
      value: null,
      update: function (value: any) {
      },
    },
    LOCAL: {
      value: 'true',
      update: function (value: any) {
      }
    }
  };

  constructor(
    private toastService: ToastService,
    private translate: TranslateService,
    private serverService: ServerService,
    private localeService: LocaleService
  ) {
    ParametersService._parameters.LANGUE.update = (value: any) => {
      this.translate.use(value);
      if (value && localeService.locale !== value) {
        localeService.setLocale(value);
      }
    };
    Filesystem.readFile({
      path: 'parameters.json',
      directory: Directory.Data,
    })
      .then(async (result) => {
        const parameters: any[] = typeof result.data === 'string' ? JSON.parse(atob(result.data)) : JSON.parse(await result.data.text());

        for (const parameter of parameters) {
          ParametersService._parameters[parameter.key].value = parameter.value;
          if (parameter.key !== 'LOCAL') {
            this.toUpdate.push(parameter.key);
          }
        }

        if (ParametersService._parameters['LANGUE'].value === null) {
          const browserLang = translate.getBrowserLang() || 'fr-FR';
          ParametersService._parameters['LANGUE'].value = ParametersService.langs.includes(browserLang) ? browserLang : 'fr-FR';
        }

        this.reload()
        this.loaded.next(true);
      })
      .catch(() => {
        this.loaded.next(true);
        this.parameters = ParametersService._parameters;
      });
  }

  static get(key: string): any {
    return ParametersService._parameters[key];
  }

  static isLocalSave(): boolean {
    return ParametersService.get('LOCAL').value === 'true';
  }

  set(key: string | any, value?: any, isObject: boolean = false): void {
    if (typeof key === 'object') {
      for (const k of Object.keys(key)) {
        this.set(k, key[k], true);
      }
      this.parameters = ParametersService._parameters;
      return;
    }

    if (ParametersService._parameters[key].value === value) {
      return;
    }

    ParametersService._parameters[key].value = value;
    this.toUpdate.push(key)

    if (!isObject) {
      this.parameters = ParametersService._parameters;
    }
  }

  reload() {
    for (const p of this.toUpdate) {
      if (ParametersService._parameters[p].update) {
        ParametersService._parameters[p].update(ParametersService._parameters[p].value, this);
      }
    }
    this.toUpdate = [];
  }
}
