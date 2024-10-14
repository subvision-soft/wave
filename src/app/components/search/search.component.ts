import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [NgIcon, FormsModule],
})
export class SearchComponent {
  get value(): string {
    return this._value;
  }

  @Input()
  set value(value: string) {
    this._value = value;
    this.valueChange.emit(value);
  }

  private _value: string = '';
  @Input() placeholder: string = '';
  @Output() valueChange: any = new EventEmitter<string>();
}
