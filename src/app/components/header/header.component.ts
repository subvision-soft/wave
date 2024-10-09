import {Component, ElementRef, EventEmitter, Input, Output, ViewChild,} from '@angular/core';
import {Location} from '@angular/common';
import {Action} from '../../models/action';
import {MenuComponent} from "../menu/menu.component";
import {IconButtonComponent} from "../icon-button/icon-button.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    MenuComponent,
    IconButtonComponent
  ],
  standalone: true
})
export class HeaderComponent {
  @Input() showBack: boolean = true;

  @Input() showMenu: boolean = true;

  @Output() menuClose: EventEmitter<void> = new EventEmitter<void>();
  @Input() actions: Action[] = [];

  @ViewChild('menuButton') menuButtonRef: ElementRef | undefined;
  openMenu: boolean = false;

  constructor(private location: Location) {
  }

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
