import { Component, OnInit } from '@angular/core';
import { Action } from '../../models/action';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../models/session';
import { FilesService } from '../../services/files.service';
import { ToastService } from '../../services/toast.service';

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
    targets: [],
    users: [],
    teams: [],
  };

  menuActions = [
    new Action('Supprimer', undefined, (self) => {}),
    new Action('Modifier', undefined, (self) => {}),
  ];

  constructor(
    private route: ActivatedRoute,
    private filesService: FilesService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const url = this.route.snapshot.queryParams['url'];
    console.log(url);
    if (url) {
      this.filesService.openFileByUrl(url).then((result) => {
        this.filesService.session = result;
        this.session = result;
      });
    }
  }

  onClickUsers() {}
}
