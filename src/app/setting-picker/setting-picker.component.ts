import { Component, Input } from '@angular/core';
import { Parameter } from '../models/parameter';
import { ParameterType } from '../models/parameter-type';
import { ParametersService } from '../services/parameters.service';

@Component({
  selector: 'app-setting-picker',
  templateUrl: './setting-picker.component.html',
  styleUrls: ['./setting-picker.component.scss'],
})
export class SettingPickerComponent {
  @Input() setting: Parameter = new Parameter();
  protected readonly ParameterType = ParameterType;

  constructor(private parametersService: ParametersService) {}

  onChange(event: any) {
    if (this.setting.type === ParameterType.Number) {
      if (
        (this.setting.min && event.target.valueAsNumber < this.setting.min) ||
        (this.setting.max && event.target.valueAsNumber > this.setting.max)
      ) {
        event.target.value = this.setting.value;
        event.preventDefault();
        return;
      }
    }
    this.setting.value = event.target.value;
    this.parametersService.set(this.setting.id, event.target.value);
  }
}
