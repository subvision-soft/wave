import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'subapp';
  tabs = [
    { icon: 'iconoirHomeSimpleDoor', label: 'Accueil', link: '/home' },
    { icon: 'iconoirCamera', label: 'Caméra', link: '/camera' },
    { icon: 'iconoirDashboardDots', label: 'Paramètres', link: '/settings' },
  ];

  tabSelected(tab: any) {
    console.log(tab);
    this.title = tab.label;
  }
}
