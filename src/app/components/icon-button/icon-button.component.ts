import { Component, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { RippleDirective } from '../../directives/ripple.directive';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  standalone: true,
  imports: [NgIcon, RippleDirective],
})
export class IconButtonComponent {
  @Input() icon: string = '';
  @Input() disabled: boolean = false;
  @Input() color: string = '';
}
