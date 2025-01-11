import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Location, NgIf } from '@angular/common';
import { Action } from '../../models/action';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { ServerConnectComponent } from '../server-connect/server-connect.component';
import { MenuComponent } from '../menu/menu.component';
import {ParametersService} from '../../services/parameters.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IconButtonComponent, NgIf, ServerConnectComponent, MenuComponent],
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
    if (obj && obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while ((obj = obj.offsetParent));
      return { x: curleft, y: curtop };
    }
    return {
      x: 0,
      y: 0,
    };
  }

  get menuX(): number {
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

  protected readonly ParametersService = ParametersService;
}
