import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-bar-button',
  templateUrl: './tab-bar-button.component.html',
  styleUrls: ['./tab-bar-button.component.scss'],
})
export class TabBarButtonComponent {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() link: string = '';
  @Input() active?: boolean = false;
}
