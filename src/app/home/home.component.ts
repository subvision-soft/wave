import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  open: boolean = false;

  seances: any[] = [
    {
      id: 1,
      name: 'Rennes 2022',
      description: 'Seance 1',
      date: new Date(),
      numberOfPeople: 28,
    },
    {
      id: 2,
      name: 'Seance 2',
      description: 'Seance 2',
      date: new Date(),
      numberOfPeople: 10,
    },
    {
      id: 1,
      name: 'Seance 1',
      description: 'Seance 1',
      date: new Date(),
      numberOfPeople: 10,
    },
    {
      id: 2,
      name: 'Seance 2',
      description: 'Seance 2',
      date: new Date(),
      numberOfPeople: 10,
    },
    {
      id: 1,
      name: 'Seance 1',
      description: 'Seance 1',
      date: new Date(),
      numberOfPeople: 10,
    },
    {
      id: 2,
      name: 'Seance 2',
      description: 'Seance 2',
      date: new Date(),
      numberOfPeople: 10,
    },
    {
      id: 1,
      name: 'Seance 1',
      description: 'Seance 1',
      date: new Date(),
      numberOfPeople: 10,
    },
    {
      id: 2,
      name: 'Seance 2',
      description: 'Seance 2',
      date: new Date(),
      numberOfPeople: 10,
    },
    {
      id: 1,
      name: 'Seance 1',
      description: 'Seance 1',
      date: new Date(),
      numberOfPeople: 10,
    },
  ];

  constructor() {}

  toggle() {
    this.open = !this.open;
  }
}
