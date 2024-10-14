import { Component } from '@angular/core';
import { Parameter } from '../../models/parameter';
import { ParameterType } from '../../models/parameter-type';
import { ParametersService } from '../../services/parameters.service';
import { FilesService } from '../../services/files.service';
import { HeaderComponent } from '../../components/header/header.component';
import { SearchComponent } from '../../components/search/search.component';
import { InputComponent } from '../../components/input/input.component';
import { NgForOf, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SelectComponent } from '../../components/select/select.component';

class ParameterGroup {
  label: string = '';
  parameters: Parameter[] = [];
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    SearchComponent,
    InputComponent,
    NgIf,
    TranslateModule,
    SelectComponent,
    NgForOf,
  ],
})
export class SettingsComponent {
  get darkTheme(): string {
    return this._darkTheme;
  }

  set darkTheme(value: string) {
    this._darkTheme = value;

    console.log(this.darkTheme === 'true' ? '#242e42' : '#ffffff');
  }

  groupIsVisible(group: ParameterGroup): boolean {
    return group.parameters.some((parameter) => {
      return parameter.label
        .toLowerCase()
        .includes(this.searchValue.toLowerCase());
    });
  }

  get settings(): ParameterGroup[] {
    return this._settings;
  }

  searchValue: string = '';

  private _darkTheme: string = 'true';

  onChange(setting: Parameter, event: any) {
    this.parametersService.set(setting.id, setting.value);
  }

  private _settings: ParameterGroup[] = [];

  initSettings() {
    this._settings = [
      {
        label: 'SETTINGS.APPEARANCE.TITLE',
        parameters: [
          {
            id: 'COULEUR_PRINCIPALE',
            label: 'SETTINGS.APPEARANCE.FIRST_COLOR',
            value: this.parametersService.get('COULEUR_PRINCIPALE').value,
            type: 'color',
          },
          {
            id: 'COULEUR_SECONDAIRE',
            label: 'SETTINGS.APPEARANCE.SECOND_COLOR',
            value: this.parametersService.get('COULEUR_SECONDAIRE').value,
            type: 'color',
          },
          {
            id: 'RAYON_BORDURES',
            label: 'SETTINGS.APPEARANCE.BORDER_RADIUS',
            value: this.parametersService.get('RAYON_BORDURES').value,
            type: 'number',
            min: 0,
            max: 40,
          },
          {
            id: 'THEME_SOMBRE',
            label: 'SETTINGS.APPEARANCE.THEME_DARK',
            value: this.parametersService.get('THEME_SOMBRE').value,
            type: 'checkbox',
          },
        ],
      },
      {
        label: 'SETTINGS.OTHERS.TITLE',
        parameters: [
          {
            id: 'URL_API',
            label: 'URL API',
            value: this.parametersService.get('URL_API').value,
            type: 'text',
          },
          {
            id: 'LANGUE',
            label: 'Langue',
            value: this.parametersService.get('LANGUE').value,
            type: 'select',
            store: [
              { id: 'fr', label: 'Français' },
              { id: 'en', label: 'English' },
              { id: 'es', label: 'Español' },
              { id: 'it', label: 'Italiano' },
            ],
          },
        ],
      },
    ];
  }

  constructor(
    private parametersService: ParametersService,
    private filesService: FilesService
  ) {
    console.log(this.parametersService.get('LANGUE').value);
    this.filesService.clearTarget();
    this.filesService.clearSession();
    this.parametersService.loaded.subscribe((loaded: boolean) => {
      this.initSettings();
    });
  }

  protected readonly ParameterType = ParameterType;
  protected readonly console = console;
}
