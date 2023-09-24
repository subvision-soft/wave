import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { Action } from '../../models/action';

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

  @ViewChild('menuButton') menuButtonRef: ElementRef | undefined;

  get menuPosition(): any {
    let curleft = 0;
    let curtop = 0;
    let obj = this.menuButtonRef?.nativeElement;
    console.log('menuPosition', obj);
    if (obj && obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while ((obj = obj.offsetParent));

      console.log('menuPosition', curleft, curtop);
      return { x: curleft, y: curtop };
    }
    return {
      x: 0,
      y: 0,
    };
  }

  get menuX(): number {
    console.log('menuX', this.menuButtonRef?.nativeElement.offsetLeft);
    return this.menuButtonRef?.nativeElement.offsetLeft || 0;
  }

  get menuY(): number {
    return this.menuButtonRef?.nativeElement.offsetTop || 0;
  }

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
