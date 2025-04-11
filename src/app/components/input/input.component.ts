import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChild,
  InputSignal,
  input
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [FormsModule, NgIf],
})
export class InputComponent {
  get value(): any {
    return this._value;
  }

  errors: InputSignal<string[]> = input<string[]>([]);

  @Input() @HostBinding('class.horizontal') horizontal: boolean = false;

  @Input()
  set value(value: any) {
    this._value = value;
    this.valueChange.emit(value);
  }

  get checked(): boolean {
    return this.value === 'true' || this.value === 'on' || this.value === true;
  }

  @Output('valueChange') valueChange = new EventEmitter<any>();
  @Input() type:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'month'
    | 'week'
    | 'url'
    | 'tel'
    | 'search'
    | 'radio'
    | 'checkbox'
    | 'color' = 'text';
  @Input() placeholder: string = '';
  private _value: any = '';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() autofocus: boolean = false;
  @Input() autocomplete: 'on' | 'off' = 'off';
  @Input() minlength: number | undefined = undefined;
  @Input() maxlength: number | undefined = undefined;
  @Input() pattern: string = '';
  @Input() size: number = 0;
  @Input() step: number = 0;
  @Input() multiple: boolean = false;
  @Input() accept: string | undefined = undefined;
  @Input() spellcheck: boolean = false;
  @Input() autocapitalize:
    | 'on'
    | 'off'
    | 'none'
    | 'sentences'
    | 'words'
    | 'characters' = 'off';
  @Input() autocorrect: 'on' | 'off' = 'off';
  @Input() max: number | undefined = undefined;
  @Input() min: number | undefined = undefined;
  @Input() name: string = '';

  @HostBinding('class') get class(): string {
    return this.type;
  }

  @ViewChild('input') input: ElementRef | undefined;

  focus(): void {
    this.input?.nativeElement.focus();
  }

  protected readonly console = console;

  onCheck() {
    this.value = this.checked ? 'false' : 'true';
  }
}
