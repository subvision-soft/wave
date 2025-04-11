import {
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  Output,
  Signal,
  signal,
  TemplateRef,
  viewChild,
  WritableSignal,
} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NgIcon} from '@ng-icons/core';
import {jamCheck} from '@ng-icons/jam-icons';
import {ModalService} from '../modal/service/modal.service';
import {Modal} from '../modal/type/Modal';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: true,
  imports: [NgForOf, NgIf, NgIcon],
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

  private modalService: ModalService = inject(ModalService);

  private modal: WritableSignal<Modal> = signal<Modal>(null);

  private modalContent: Signal<TemplateRef<any>> = viewChild<TemplateRef<any>>('modalContent');

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
    if (!open && this.modal()) {
      this.modalService.close(this.modal())
    } else if (open) {
      this.modal.set(this.modalService.open({
        content: this.modalContent(),
        closeable: {
          maskClose: true,
        },
        type: 'custom',
      }));
    }

  }

  protected readonly jamCheck = jamCheck;
}
