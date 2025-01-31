import {Component} from '@angular/core';
import {Action} from '../../models/action';
import {Team} from '../../models/team';
import {Session} from '../../models/session';
import {Category} from '../../models/category';
import {FilesService} from '../../services/files.service';
import {SearchComponent} from '../../components/search/search.component';
import {AddButtonComponent} from '../../components/add-button/add-button.component';
import {EmptyTextComponent} from '../../components/empty-text/empty-text.component';
import {TeamItemComponent} from '../../components/team-item/team-item.component';
import {LongPressDirective} from '../../directives/long-press.directive';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MessageBoxComponent} from '../../components/message-box/message-box.component';
import {InputComponent} from '../../components/input/input.component';
import {SelectComponent} from '../../components/select/select.component';
import {HeaderComponent} from '../../components/header/header.component';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  standalone: true,
  imports: [
    SearchComponent,
    AddButtonComponent,
    EmptyTextComponent,
    TeamItemComponent,
    LongPressDirective,
    NgIf,
    NgForOf,
    MessageBoxComponent,
    InputComponent,
    SelectComponent,
    DatePipe,
    HeaderComponent,
  ],
})
export class TeamsComponent {
  searchValue = '';
  openCreateTeam = false;
  create: boolean = true;
  menuActions = [
    new Action(
      'Supprimer l\'équipe',
      undefined,
      () => {
        if (!confirm("Etes vous sur de vouloir supprimer l'équipe \"" + this.selectedTeams[0].name + "\"")) {
          return;
        }
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
      'Modifier l\'équipe',
      undefined,
      () => {
        this.openCreateTeam = true;
        this.newTeam = this.selectedTeams[0];
        this.create = false;
      },
      undefined,
      () => {
        return this.selectedTeams.length == 1;
      }
    ),
    new Action('Ajouter une équipe', undefined, () => {
      this.createTeam();
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
        id: 592,
        label: '',
        firstname: 'Paul',
        lastname: 'Coignac',
        category: Category.SENIOR,
      },
      {
        id: 1092,
        label: '',
        firstname: 'Baptiste',
        lastname: 'De Treverret',
        category: Category.SENIOR,
      },
      {
        id: 3,
        label: '',
        firstname: 'Tireur',
        lastname: '3',
        category: Category.SENIOR,
      },
    ],
    teams: [
      {
        id: 1,
        name: 'Equipe 1',
        users: [592, 1092],
      },
    ],
    targets: [],
    path: '',
    size: 0
  };

  constructor(
    private readonly filesService: FilesService,
  ) {
    this.session = this.filesService.session || this.session;
    this.storeUsers = this.session.users
  }

  storeUsers: any[] = [];

  newTeam: Team = {
    id: 1,
    name: '',
    users: [],
  };

  createTeamCallback(event: any) {
    if (event.btn === 'ok' && this.isRequired(this.newTeam.name)) {
      if (this.create) {
        this.newTeam.id = this.session.teams.length;
      } else {
        this.session.teams = this.session.teams.filter(team => team.id !== this.newTeam.id);
      }
      this.session.teams.push({...this.newTeam});
      this.filesService.session = this.session;
      this.openCreateTeam = false;
    }
  }

  get teams(): Team[] {
    return this.session.teams.filter((team) =>
      team.name.toLowerCase().includes(this.searchValue.toLowerCase())
    );
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
  createTeam(): void {
    this.openCreateTeam = true;
    this.create = true;
    this.newTeam = {
      id: 1,
      name: '',
      users: [],
    };
  }

  isRequired(field: any): boolean {
    return field !== undefined && field !== null && field !== '';
  }
}
