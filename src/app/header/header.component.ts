import { Component, Input } from '@angular/core';
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

  menuSort: boolean = false;

  sortActions: Action[] = [
    {
      label: 'Nom',
      icon: '',
      action: () => {
        console.log('Trier par nom');
      },
    },
    {
      label: 'Type',
      icon: '',
      action: () => {
        console.log('Trier par date');
      },
    },
    {
      label: 'Du plus grand au plus petit',
      icon: '',
      action: () => {
        console.log('Trier par taille');
      },
    },
    {
      label: 'Du plus petit au plus grand',
      icon: '',
      action: () => {
        console.log('Trier par taille');
      },
    },
    {
      label: 'Date de modification',
      icon: '',
      action: () => {
        console.log('Trier par type');
      },
    },
  ];

  @Input() actions: Action[] = [
    {
      label: 'Créer un nouveau dossier',
      icon: '',
      action: () => {
        console.log('Créer un nouveau dossier');
      },
    },
    {
      label: 'Trier par',
      icon: '',
      action: () => {
        this.menuSort = true;
        console.log('Trier par');
      },
    },
  ];

  openMenu: boolean = false;

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  toggleMenu() {
    this.openMenu = !this.openMenu;
  }
}
