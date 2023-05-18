import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iconoirHome } from '@ng-icons/iconoir';
import { Router } from '@angular/router';

class Tab {
  active?: boolean = false;
  link: string = '';
  label: string = '';
  icon: string = '';
}

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
})
export class TabBarComponent {
  @Input() tabs: Tab[] = [];
  @Output() select = new EventEmitter<Tab>();
  private title: string = '';

  protected readonly iconoirHome = iconoirHome;
  constructor(private router: Router) {
    router.events.subscribe((val) => {
      this.updateActive();
    });
  }

  private updateActive() {
    const path = this.router.url;

    this.tabs.forEach((tab) => {
      tab.active = tab.link === path;
      this.title = tab.label;
      if (tab.active) {
        this.select.emit(tab);
      }
    });
  }
}
