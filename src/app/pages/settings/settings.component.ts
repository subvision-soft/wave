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
  get settings(): ParameterGroup[] {
    return this._settings.map((group) => {
      return {
        label: group.label,
        parameters: group.parameters.filter((parameter) => {
          return parameter.label
            .toLowerCase()
            .includes(this.searchValue.toLowerCase());
        }),
      };
    });
  }

  searchValue: string = '';

  private _settings: ParameterGroup[] = [
    {
      label: 'Apparence',
      parameters: [
        {
          id: 'COULEUR_PRINCIPALE',
          label: 'Couleur principale',
          value: this.parametersService.get('COULEUR_PRINCIPALE').value,
          type: ParameterType.Color,
        },
        {
          id: 'COULEUR_SECONDAIRE',
          label: 'Couleur secondaire',
          value: this.parametersService.get('COULEUR_SECONDAIRE').value,
          type: ParameterType.Color,
        },
        {
          id: 'RAYON_BORDURES',
          label: 'Rayon des bordures',
          value: this.parametersService.get('RAYON_BORDURES').value,
          type: ParameterType.Number,
          min: 0,
          max: 40,
        },
        {
          id: 'TAILLE_POLICE',
          label: 'Taille de police',
          value: this.parametersService.get('TAILLE_POLICE').value,
          min: 10,
          max: 40,
          type: ParameterType.Number,
        },
        {
          id: 'TAILLE_ESPACES',
          label: 'Taille des espacements',
          value: this.parametersService.get('TAILLE_ESPACES').value,
          min: 10,
          max: 40,
          type: ParameterType.Number,
        },
      ],
    },
  ];

  constructor(private parametersService: ParametersService) {}
}
