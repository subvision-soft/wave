import {Component, OnInit} from '@angular/core';
import {Action} from '../../models/action';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Session} from '../../models/session';
import {FilesService} from '../../services/files.service';
import {TranslateModule} from '@ngx-translate/core';
import {NgIcon} from '@ng-icons/core';
import {DatePipe, NgPlural, NgPluralCase} from '@angular/common';
import {RippleDirective} from '../../directives/ripple.directive';
import {HeaderComponent} from '../../components/header/header.component';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    NgIcon,
    NgPlural,
    RippleDirective,
    RouterLink,
    DatePipe,
    HeaderComponent,
    NgPluralCase
  ],
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
      this.filesService.openFileByUrl(url, true).then((result) => {
        this.filesService.path = url;
        this.filesService.loadSession(result);
        this.session = result;
      });
    }
  }
}
