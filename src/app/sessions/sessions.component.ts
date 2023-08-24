import { Component } from '@angular/core';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent {
  get sessions(): any[] {
    return this._sessions.filter(
      (session) =>
        session.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        session.description
          .toLowerCase()
          .includes(this.searchValue.toLowerCase())
    );
  }

  searchValue: string = '';
  _sessions: any[] = [
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
}
