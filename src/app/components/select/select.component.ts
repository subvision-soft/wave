import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  @Input() store: any[] = [];
  @Input() displayField: string = 'label';
  @Input() valueField: string = 'id';
  @Input() value: any | null = undefined;
  @Input() label: string = '';
  @Output() valueChange = new EventEmitter<any>();

  @Input() @HostBinding('class.compact') compact: boolean = false;

  get displayedField(): string {
    const record = this.store.find(
      (item) => item[this.valueField] === this.value
    );
    if (record) {
      return record[this.displayField];
    } else {
      return '';
    }
  }

  select(value: any): void {
    this.value = value;
    this.open = false;
    this.valueChange.emit(this.value);
  }

  open: boolean = false;

  constructor() {}

  openChange(open: boolean) {
    this.open = open;
  }
}
