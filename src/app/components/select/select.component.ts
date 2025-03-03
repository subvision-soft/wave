import {Component, EventEmitter, HostBinding, Input, Output,} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NgIcon} from '@ng-icons/core';
import {SlideSheetComponent} from '../slide-sheet/slide-sheet.component';
import {jamCheck} from '@ng-icons/jam-icons';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: true,
  imports: [NgForOf, NgIf, NgIcon, SlideSheetComponent],
})
export class SelectComponent {
  @Input() store: any[] = [];
  @Input() displayField: string = 'label';
  @Input() valueField: string = 'id';
  @Input() value: any | any[] = '';
  @Input() label?: string;
  @Input() @HostBinding('class.multiple') multiple: boolean = false;
  @Input() placeholder: string = '';
  @Output() valueChange = new EventEmitter<any>();

  @Input() @HostBinding('class.compact') compact: boolean = false;

  get displayedField(): string[] {
    if (Array.isArray(this.value)) {
      return this.value.map((value) => {
        const record = this.store.find(
          (record) => record[this.valueField] === value
        );
        return record ? record[this.displayField] : '';
      });
    }
    const record = this.store.find(
      (record) => record[this.valueField] === this.value
    );
    return record ? [record[this.displayField]] : [];
  }

  select(value: any): void {
    if (this.multiple) {
      if (Array.isArray(this.value)) {
        if (this.value.includes(value)) {
          this.value = this.value.filter((item) => item !== value);
        } else {
          this.value.push(value);
        }
      } else {
        this.value = [value];
      }
    } else {
      this.value = value;
    }
    this.valueChange.emit(this.value);
    if (!this.multiple) {
      this.open = false;
    }
  }

  isSelected(record: any) {
    if (Array.isArray(this.value)) {
      return this.value.includes(record[this.valueField]);
    }

    return record[this.valueField] === this.value;
  }

  open: boolean = false;

  constructor() {
  }

  openChange(open: boolean) {
    this.open = open;
  }

  protected readonly jamCheck = jamCheck;
}
