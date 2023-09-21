import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
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
  @Input() value: string = '';
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

  @HostListener('click') onClick(): void {}

  @ViewChild('input') input: ElementRef | undefined;

  focus(): void {
    this.input?.nativeElement.focus();
  }
}
