import { Component } from '@angular/core';
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { Location, NgIf } from '@angular/common';
import { TagComponent } from '../../components/tag/tag.component';
import { HeaderComponent } from '../../components/header/header.component';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { ListTargetsComponent } from '../../components/list-targets/list-targets.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [
    TagComponent,
    HeaderComponent,
    NgIf,
    AddButtonComponent,
    ListTargetsComponent,
  ],
})
export class UserComponent {
  protected user: User | undefined;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _location: Location
  ) {
    this._activatedRoute.paramMap
      .pipe(map(() => window.history.state))
      .subscribe((res) => {
        if (res.user) {
          this.user = res.user;
        } else {
          this._location.back();
        }
      });
  }
}
