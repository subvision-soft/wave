import { Component, OnInit } from '@angular/core';
import { Action } from '../../models/action';
import { ActivatedRoute } from '@angular/router';
import { Session } from '../../models/session';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit {
  session: Session = {
    date: new Date(),
    description: '',
    title: '',
    users: [],
    teams: [],
  };

  menuActions = [
    new Action('Supprimer', undefined, () => {}),
    new Action('Modifier', undefined, () => {}),
  ];

  get targets() {
    return this.session.users.flatMap((user) => {
      return user.targets || [];
    });
  }

  constructor(
    private route: ActivatedRoute,
    private filesService: FilesService
  ) {}

  ngOnInit(): void {
    const url = this.route.snapshot.queryParams['url'];
    if (url) {
      this.filesService.openFileByUrl(url).then((result) => {
        this.filesService.session = result;
        this.filesService.path = url;
        this.session = result;
      });
    }
  }
}
