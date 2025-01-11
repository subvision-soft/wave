import {Component, Input} from '@angular/core';
import {Parameter} from '../../models/parameter';
import {ParametersService} from '../../services/parameters.service';
import {ParameterType} from '../../models/parameter-type';

@Component({
  selector: 'app-setting-picker',
  templateUrl: './setting-picker.component.html',
  styleUrls: ['./setting-picker.component.scss'],
  standalone: true,
})
export class SettingPickerComponent {
  @Input() setting: Parameter = new Parameter();

  constructor(private parametersService: ParametersService) {
  }

  onChange(event: any) {
    if (this.setting.type === ParameterType.Number && (
      (this.setting.min && event.target.valueAsNumber < this.setting.min) ||
      (this.setting.max && event.target.valueAsNumber > this.setting.max)
    )) {
      event.target.value = this.setting.value;
      event.preventDefault();
      return;
    }
    this.setting.value = event.target.value;
    this.parametersService.set(this.setting.id, event.target.value);
  }
}
