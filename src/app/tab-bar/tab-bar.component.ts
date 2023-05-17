import {Component, Input} from '@angular/core';
import {iconoirHome} from "@ng-icons/iconoir";

class Tab {
  constructor(public icon: string, public label: string, public link: string) {
    this.icon = icon;
    this.label = label;
    this.link = link;
  }
}

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss']
})
export class TabBarComponent {
  @Input() tabs: Tab[] = [];

  protected readonly iconoirHome = iconoirHome;
}
