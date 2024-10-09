import {Component, EventEmitter, HostBinding, Input, Output,} from '@angular/core';
import {Action} from '../../models/action';
import {RippleDirective} from '../../directives/ripple.directive';
import {NgIf} from "@angular/common";
import {NgIcon} from "@ng-icons/core";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-menu-action',
  templateUrl: './menu-action.component.html',
  styleUrls: ['./menu-action.component.scss'],
  hostDirectives: [RippleDirective],
  imports: [
    NgIf,
    NgIcon,
    TranslateModule
  ],
  standalone: true
})
export class MenuActionComponent {
  @Input() action: Action = new Action();
  @Input() @HostBinding('class.border') border: boolean = true;
  @Output() click: EventEmitter<boolean> = new EventEmitter<boolean>();
}
