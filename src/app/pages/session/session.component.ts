import {Component, OnInit} from '@angular/core';
import {Action} from '../../models/action';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Session} from '../../models/session';
import {FilesService} from '../../services/files.service';
import {DatePipe, NgPlural} from "@angular/common";
import {HeaderComponent} from "../../components/header/header.component";
import {RippleDirective} from "../../directives/ripple.directive";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {NgIcon} from "@ng-icons/core";

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  imports: [
    NgPlural,
    HeaderComponent,
    RippleDirective,
    IonicModule,
    DatePipe,
    TranslateModule,
    NgIcon,
    RouterLink
  ],
  standalone: true
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
    new Action('Supprimer', undefined, () => {
    }),
    new Action('Modifier', undefined, () => {
    }),
  ];

  get targets() {
    return this.session.users.flatMap((user) => {
      return user.targets || [];
    });
  }

  constructor(
    private route: ActivatedRoute,
    private filesService: FilesService
  ) {
  }

  ngOnInit(): void {
    const url = this.route.snapshot.queryParams['url'];
    if (url) {
      this.filesService.openFileByUrl(url, true).then((result) => {
        this.filesService.path = url;
        this.filesService.loadSession(result);
        this.session = result;
      });
    }
  }
}
