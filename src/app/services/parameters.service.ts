import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ParametersService {
  get parameters(): any {
    return this._parameters;
  }

  private _parameters: any = {
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
      update: function (value: any) {},
    },
  };

  constructor() {}

  get(key: string): any {
    return this._parameters[key];
  }

  set(key: string | any, value?: any): void {
    if (typeof key === 'object') {
      for (const k of Object.keys(key)) {
        this._parameters[k].value = key[k];
        if (this._parameters[k].update) {
          this._parameters[k].update(this._parameters[k].value);
        }
      }
      return;
    }

    this._parameters[key].value = value;
    if (this._parameters[key].update) {
      this._parameters[key].update(this._parameters[key].value);
    }
  }
}
