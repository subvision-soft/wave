import { Component } from '@angular/core';
import { Parameter } from '../../models/parameter';
import { ParameterType } from '../../models/parameter-type';
import { ParametersService } from '../../services/parameters.service';

class ParameterGroup {
  label: string = '';
  parameters: Parameter[] = [];
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  get darkTheme(): string {
    return this._darkTheme;
  }

  set darkTheme(value: string) {
    this._darkTheme = value;

    console.log(this.darkTheme === 'true' ? '#242e42' : '#ffffff');
  }

  get settings(): ParameterGroup[] {
    return this._settings;
    // return this._settings.map((group) => {
    //   return {
    //     label: group.label,
    //     parameters: group.parameters.filter((parameter) => {
    //       return parameter.label
    //         .toLowerCase()
    //         .includes(this.searchValue.toLowerCase());
    //     }),
    //   };
    // });
  }

  trackParameter(index: number, parameter: Parameter): string {
    return parameter.id;
  }

  searchValue: string = '';

  private _darkTheme: string = 'true';

  onChange(setting: Parameter, event: any) {
    console.log(setting);
    console.log(event);
    this.parametersService.set(setting.id, setting.value);
  }

  private _settings: ParameterGroup[] = [
    {
      label: 'Apparence',
      parameters: [
        {
          id: 'COULEUR_PRINCIPALE',
          label: 'Couleur principale',
          value: this.parametersService.get('COULEUR_PRINCIPALE').value,
          type: 'color',
        },
        {
          id: 'COULEUR_SECONDAIRE',
          label: 'Couleur secondaire',
          value: this.parametersService.get('COULEUR_SECONDAIRE').value,
          type: 'color',
        },
        {
          id: 'RAYON_BORDURES',
          label: 'Rayon des bordures',
          value: this.parametersService.get('RAYON_BORDURES').value,
          type: 'number',
          min: 0,
          max: 40,
        },
        {
          id: 'TAILLE_POLICE',
          label: 'Taille de police',
          value: this.parametersService.get('TAILLE_POLICE').value,
          min: 10,
          max: 40,
          type: 'number',
        },
        {
          id: 'TAILLE_ESPACES',
          label: 'Taille des espacements',
          value: this.parametersService.get('TAILLE_ESPACES').value,
          min: 10,
          max: 40,
          type: 'number',
        },
        {
          id: 'THEME_SOMBRE',
          label: 'Thème sombre',
          value: this.parametersService.get('THEME_SOMBRE').value,
          type: 'checkbox',
        },
      ],
    },
  ];

  constructor(private parametersService: ParametersService) {}

  protected readonly ParameterType = ParameterType;
  protected readonly console = console;
}
