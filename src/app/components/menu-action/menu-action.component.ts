import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { Action } from '../../models/action';
import { RippleDirective } from '../../directives/ripple.directive';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-menu-action',
  templateUrl: './menu-action.component.html',
  styleUrls: ['./menu-action.component.scss'],
  hostDirectives: [RippleDirective],
  standalone: true,
  imports: [NgIcon, NgIf, TranslateModule],
})
export class MenuActionComponent {
  @Input() action: Action = new Action();
  @Input() @HostBinding('class.border') border: boolean = true;
  @Output() click: EventEmitter<boolean> = new EventEmitter<boolean>();
}
