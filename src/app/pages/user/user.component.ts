import { Component } from '@angular/core';
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
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
