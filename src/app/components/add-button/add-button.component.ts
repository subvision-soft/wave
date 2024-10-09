import {Component, Input} from '@angular/core';
import {RippleDirective} from '../../directives/ripple.directive';
import {NgIcon} from "@ng-icons/core";

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss'],
  hostDirectives: [RippleDirective],
  imports: [
    NgIcon
  ],
  standalone: true
})
export class AddButtonComponent {
  @Input() label: string = '';
}
