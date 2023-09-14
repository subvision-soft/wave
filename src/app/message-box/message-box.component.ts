import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

interface Callback {
  btn: 'ok' | 'cancel';
  value?: string;
}

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss'],
  animations: [
    trigger('openAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translate(0, calc(100% + var(--padding)))',
        }),
        animate('200ms', style({ opacity: 1, transform: 'translate(0)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translate(0)' }),
        animate(
          '200ms',
          style({
            opacity: 0,
            transform: 'translate(0, calc(100% + var(--padding)))',
          })
        ),
      ]),
    ]),
  ],
})
export class MessageBoxComponent {
  get open(): boolean {
    return this._open;
  }

  @Input()
  set open(value: boolean) {
    this._open = value;
    if (this._open) {
      setTimeout(() => {
        this.prompt?.nativeElement.focus();
      }, 100);
    }
  }

  @HostBinding('class.open') private _open: boolean = false;
  @ViewChild('prompt') prompt: ElementRef<HTMLElement> | undefined;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() type: 'prompt' | 'okcancel' = 'okcancel';
  @Input() title: string = '';
  @Input() message: string = '';

  @Output() callback: EventEmitter<Callback> = new EventEmitter<Callback>();

  promptValue: string = '';

  get OKCANCEL() {
    return this.type === 'okcancel';
  }

  get PROMPT() {
    return this.type === 'prompt';
  }

  click(btn: 'ok' | 'cancel') {
    if (this.PROMPT) {
      this.callback.emit({
        btn,
        value: this.promptValue,
      });
    } else {
      this.callback.emit({
        btn,
      });
    }
    this.close();
  }

  constructor() {}

  close() {
    this._open = false;
    this.openChange.emit(this._open);
  }
}
