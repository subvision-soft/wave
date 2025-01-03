import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Actuality} from '../../models/actuality';
import {map} from 'rxjs';
import {DatePipe} from '@angular/common';
import {HeaderComponent} from '../../components/header/header.component';
import {LogoComponent} from '../../components/logo/logo.component';

@Component({
  selector: 'app-actuality',
  standalone: true,
  imports: [
    DatePipe,
    HeaderComponent,
    LogoComponent
  ],
  templateUrl: './actuality.component.html',
  styleUrl: './actuality.component.scss'
})
export class ActualityComponent {

  actuality = signal<Actuality | null>(null);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  constructor() {
    this.activatedRoute.params.subscribe(params => {
      this.activatedRoute.paramMap
        .pipe(map(() => window.history.state))
        .subscribe((res) => {
            console.log(res);
            if (res) {
              this.actuality.set(res);
            } else {
              this.router.navigate(['/']);
            }
          }
        );
    });
  }


}
