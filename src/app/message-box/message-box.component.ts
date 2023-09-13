import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

interface Callback {
  btn: 'ok' | 'cancel';
  value?: string;
}

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss'],
})
export class MessageBoxComponent {
  @Input() @HostBinding('class.open') open: boolean = false;
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
    this.open = false;
    this.openChange.emit(this.open);
  }
}
