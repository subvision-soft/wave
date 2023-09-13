import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Action } from '../models/action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() showBack: boolean = true;

  @Input() showMenu: boolean = true;

  @Output() menuClose: EventEmitter<void> = new EventEmitter<void>();

  menuSort: boolean = false;

  @Input() actions: Action[] = [];

  openMenu: boolean = false;

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  toggleMenu() {
    this.openMenu = !this.openMenu;
    if (!this.openMenu) {
      this.menuClose.emit();
    }
  }
}
