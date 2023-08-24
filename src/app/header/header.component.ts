import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() showBack: boolean = true;

  @Input() showMenu: boolean = true;

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
