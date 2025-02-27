import {Component, EventEmitter, isDevMode, Output} from '@angular/core';
import {iconoirHome} from '@ng-icons/iconoir';
import {Router} from '@angular/router';
import {TabBarButtonComponent} from '../tab-bar-button/tab-bar-button.component';
import {NgForOf} from '@angular/common';
import {ParametersService} from '../../services/parameters.service';

class Tab {
  active?: boolean = false;
  link: string = '';
  label: string = '';
  icon: string = '';
  hidden: boolean | (() => boolean) = false;
}

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
  standalone: true,
  imports: [TabBarButtonComponent, NgForOf],
})
export class TabBarComponent {
  tabs: Tab[] = [
    {icon: 'jamJoystick', label: 'Playground', link: '/playground', hidden: !isDevMode()},
    {icon: 'jamHomeF', label: 'Accueil', link: '/home', hidden: false},
    {icon: 'jamCameraF', label: 'Caméra', link: '/camera', hidden: false},
    {
      icon: 'jamFolderF', label: 'Sessions', link: '/sessions', hidden: () => {
        return !ParametersService.isLocalSave()
      }
    },
    {
      icon: 'jamUser', label: 'Tireurs', link: '/users', hidden: () => {
        return !ParametersService.isLocalSave()
      }
    },
    {icon: 'jamCogF', label: 'Paramètres', link: '/settings', hidden: false},
  ];
  @Output() select = new EventEmitter<Tab>();

  protected readonly iconoirHome = iconoirHome;

  constructor(private router: Router) {
    router.events.subscribe(() => {
      this.updateActive();
    });
  }

  getTabs(): Tab[] {
    return this.tabs.filter(tab => !tab.hidden || (typeof tab.hidden === 'function' && !tab.hidden()));
  }

  private updateActive() {
    const path = this.router.url;

    this.tabs.forEach((tab) => {
      tab.active = path.startsWith(tab.link);
      if (tab.active) {
        this.select.emit(tab);
      }
    });
  }
}
