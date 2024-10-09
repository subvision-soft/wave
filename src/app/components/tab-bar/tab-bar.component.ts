import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {NgForOf} from "@angular/common";
import {TabBarButtonComponent} from "../tab-bar-button/tab-bar-button.component";

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
  imports: [
    NgForOf,
    TabBarButtonComponent
  ],
  standalone: true
})
export class TabBarComponent {
  @Input() tabs: Tab[] = [];
  @Output() select = new EventEmitter<Tab>();

  constructor(private router: Router) {
    router.events.subscribe((val) => {
      this.updateActive();
    });
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
