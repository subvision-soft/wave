import {Component} from '@angular/core';
import {Parameter} from '../../models/parameter';
import {ParameterType} from '../../models/parameter-type';
import {ParametersService} from '../../services/parameters.service';
import {FilesService} from '../../services/files.service';
import {HeaderComponent} from '../../components/header/header.component';
import {SearchComponent} from '../../components/search/search.component';
import {InputComponent} from '../../components/input/input.component';
import {NgForOf, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {SelectComponent} from '../../components/select/select.component';

class ParameterGroup {
  label: string = '';
  parameters: Parameter[] = [];
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [HeaderComponent, SearchComponent, InputComponent, NgIf, TranslateModule, SelectComponent, NgForOf,],
})
export class SettingsComponent {
  searchValue: string = '';
  protected readonly ParameterType = ParameterType;
  protected readonly console = console;

  constructor(private parametersService: ParametersService, private filesService: FilesService) {
    console.log(ParametersService.get('LANGUE').value);
    this.filesService.clearSession();
    this.parametersService.loaded.subscribe(() => {
      this.initSettings();
    });
  }

  private _darkTheme: string = 'true';

  get darkTheme(): string {
    return this._darkTheme;
  }

  set darkTheme(value: string) {
    this._darkTheme = value;

    console.log(this.darkTheme === 'true' ? '#242e42' : '#ffffff');
  }

  private _settings: ParameterGroup[] = [];

  get settings(): ParameterGroup[] {
    return this._settings;
  }

  groupIsVisible(group: ParameterGroup): boolean {
    return group.parameters.some((parameter) => {
      return parameter.label
        .toLowerCase()
        .includes(this.searchValue.toLowerCase());
    });
  }

  onChange(setting: Parameter, event: any) {
    this.parametersService.set(setting.id, setting.value);
  }

  initSettings() {
    this._settings = [{
      label: 'SETTINGS.APPEARANCE.TITLE', parameters: [
        // {
        //   id: 'COULEUR_PRINCIPALE',
        //   label: 'SETTINGS.APPEARANCE.FIRST_COLOR',
        //   value: ParametersService.get('COULEUR_PRINCIPALE').value,
        //   type: 'color',
        // }, {
        //   id: 'COULEUR_SECONDAIRE',
        //   label: 'SETTINGS.APPEARANCE.SECOND_COLOR',
        //   value: ParametersService.get('COULEUR_SECONDAIRE').value,
        //   type: 'color',
        // }, {
        //   id: 'RAYON_BORDURES',
        //   label: 'SETTINGS.APPEARANCE.BORDER_RADIUS',
        //   value: ParametersService.get('RAYON_BORDURES').value,
        //   type: 'number',
        //   min: 0,
        //   max: 40,
        // },
        {
          id: 'THEME_SOMBRE',
          label: 'SETTINGS.APPEARANCE.THEME_DARK',
          value: ParametersService.get('THEME_SOMBRE').value,
          type: 'checkbox',
        },

      ],
    }, {
      label: 'SETTINGS.OTHERS.TITLE', parameters: [
        {
          id: 'VALID_SHEET_BEFORE_PROCESS',
          label: 'SETTINGS.OTHERS.VALID_SHEET_BEFORE_PROCESS',
          value: ParametersService.get('VALID_SHEET_BEFORE_PROCESS').value,
          type: 'number',
          min: 0,
          max: 40,
        },
        {
          id: 'LOCAL',
          label: 'SETTINGS.OTHERS.LOCAL_SAVE',
          value: ParametersService.get('LOCAL').value,
          type: 'checkbox',
        },
        {
          id: 'URL_API', label: 'URL API', value: ParametersService.get('URL_API').value, type: 'text',
        },
        {
          id: 'URL_API_SUBVISION',
          label: 'SETTINGS.OTHERS.SUBVISION_API_URL',
          value: ParametersService.get('URL_API_SUBVISION')?.value,
          type: 'text',
        },
        {
          id: 'LANGUE', label: 'Langue', value: ParametersService.get('LANGUE').value, type: 'select', store: [{
            id: 'fr-FR', label: 'Français'
          }, {
            id: 'en-UK', label: 'English'
          }, {
            id: 'es-ES', label: 'Español'
          }, {
            id: 'it-IT', label: 'Italiano'
          },],
        },],
    },];
  }
}
