import { Component } from '@angular/core';
import {Action} from "../../models/action";
import {Team} from "../../models/team";
import {Session} from "../../models/session";
import {Category} from "../../models/category";
import {FilesService} from "../../services/files.service";

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent {
  searchValue = '';
  openCreateTeam = false;
  menuActions = [
    new Action(
      'Supprimer le tireur',
      undefined,
      () => {
        this.session.teams = this.session.teams.filter(
          (team) => !this.selectedTeams.includes(team)
        );
        this.filesService.session = this.session;
        this.selectedTeams = [];
      },
      undefined,
      () => this.selectedTeams.length > 0
    ),
    new Action(
      'Modifier le tireur',
      undefined,
      (self) => {},
      undefined,
      () => {
        console.log(this.selectedTeams);
        return this.selectedTeams.length == 1;
      }
    ),
    new Action('Ajouter un tireur', undefined, (self) => {
      this.openCreateTeam = true;
    }),
  ];
  timeoutLongPress: Date = new Date();

  selectedTeams: Team[] = [];

  session: Session = {
    title: 'Rennes',
    description: 'Description 1',
    date: new Date(),
    users: [
      {
        id: '1',
        name: 'Tireur 1',
        category: Category.SENIOR,
        targets: [],
      },
      {
        id: '2',
        name: 'Tireur 2',
        category: Category.SENIOR,
        targets: [],
      },
    ],
    teams: [],
  };

  constructor(private filesService: FilesService) {
    this.session = this.filesService.session || this.session;
    this.storeUsers = this.session.users.map((user) => {
      return {
        id: user.id,
        label: `(${user.id}) ${user.name}`,
      };
    }
    );
  }

  storeUsers:any[] = [
  ];

  newTeam: Team = {
    name: '',
    users: [],
  };

  createTeamCallback(event: any) {
    if (event.btn === 'ok') {
      this.session.teams.push({ ...this.newTeam });
      this.filesService.session = this.session;
    }
  }

  get teams(): Team[] {
    return this.session.teams.filter(
      (team) =>
        team.name.toLowerCase().includes(this.searchValue.toLowerCase()));
  }

  isTeamSelected(team: Team): boolean {
    return this.selectedTeams.includes(team);
  }

  onLongPress(event: any, team: Team) {
    this.timeoutLongPress = new Date();
    if (this.isTeamSelected(team)) return;
    this.selectedTeams.push(team);
  }

  teamClick(team: Team) {
    if (new Date().getTime() - this.timeoutLongPress.getTime() < 500) return;
    if (this.selectedTeams.length > 0) {
      if (this.isTeamSelected(team)) {
        this.selectedTeams = this.selectedTeams.filter((u) => u !== team);
      } else {
        this.selectedTeams.push(team);
      }
    } else {
      // Ouvrir page team
    }
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }
}
