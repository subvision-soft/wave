import {Component, Input} from '@angular/core';
import {NgIcon} from "@ng-icons/core";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {RippleDirective} from "../../directives/ripple.directive";

@Component({
  selector: 'app-tab-bar-button',
  templateUrl: './tab-bar-button.component.html',
  styleUrls: ['./tab-bar-button.component.scss'],
  imports: [
    NgIcon,
    RouterLinkActive,
    RouterLink,
    RippleDirective
  ],
  standalone: true
})
export class TabBarButtonComponent {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() link: string = '';
  @Input() active?: boolean = false;
}
