import { Component, Input } from '@angular/core';
import { RippleDirective } from '../../directives/ripple.directive';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss'],
  hostDirectives: [RippleDirective],
})
export class AddButtonComponent {
  @Input() label: string = '';
}
