import { Component } from '@angular/core';
import { Session } from '../../models/session';
import { Category } from '../../models/category';
import { FilesService } from '../../services/files.service';
import { Event } from '../../models/event';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { SearchComponent } from '../../components/search/search.component';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { HeaderComponent } from '../../components/header/header.component';
import { SegmentedButtonComponent } from '../../components/segmented-button/segmented-button.component';
import { ListTargetsComponent } from '../../components/list-targets/list-targets.component';
import { TranslateModule } from '@ngx-translate/core';
import {DatePipe, NgIf} from '@angular/common';
import {Target} from '../../models/target';

@Component({
  selector: 'app-targets',
  templateUrl: './targets.component.html',
  styleUrls: ['./targets.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
  standalone: true,
  imports: [
    SearchComponent,
    AddButtonComponent,
    HeaderComponent,
    SegmentedButtonComponent,
    ListTargetsComponent,
    TranslateModule,
    DatePipe,
    NgIf,
  ],
})
export class TargetsComponent {
  searchValue = '';

  get targets() {
    return this.session.targets
      .filter((target: Target) => {
        if (!this.eventFilter) return true;
        return target.event === this.eventFilter;
      });
  }

  eventFilter?: Event = undefined;

  segmentedButtonItems = [
    {
      label: 'TARGETS.SEGMENTED_BUTTON.ALL',
      key: 'all',
      onClick: () => {
        this.eventFilter = undefined;
      },
    },
    {
      label: 'TARGETS.SEGMENTED_BUTTON.PRECISION',
      key: 'precision',
      onClick: () => {
        this.eventFilter = Event.PRECISION;
      },
    },
    {
      label: 'TARGETS.SEGMENTED_BUTTON.BIATHLON',
      key: 'biathlon',
      onClick: () => {
        this.eventFilter = Event.BIATHLON;
      },
    },
    {
      label: 'TARGETS.SEGMENTED_BUTTON.SUPER_BIATHLON',
      key: 'super-biathlon',
      onClick: () => {
        this.eventFilter = Event.SUPER_BIATHLON;
      },
    },
    {
      label: 'TARGETS.SEGMENTED_BUTTON.FREE_INPUT',
      key: 'saisie-libre',
      onClick: () => {
        this.eventFilter = Event.SAISIE_LIBRE;
      },
    },
  ];
  selectedSegmentedButton = 'all';

  menuActions = [];

  selectedTargets: any[] = [];

  session: Session = {
    title: 'Rennes',
    description: 'Description 1',
    date: new Date(),
    users: [
      {
        id: 1,
        label: '',
        firstname: 'User',
        lastname: '1',
        category: Category.SENIOR,
      },
    ],
    teams: [],
    targets: [
      {
        impacts: [],
        event: Event.SUPER_BIATHLON,
        total: 0,
        time: 0,
        date: new Date(),
        user: 1,
        image: '',
        shotsTooCloseCount: 0,
        badArrowExtractionsCount: 0,
        targetSheetNotTouchedCount: 0,
        departureSteal: false,
        armedBeforeCountdown: false,
        timeRanOut: false,
      },
    ],
    path: '',
    size: 0
  };

  constructor(private filesService: FilesService, private readonly router: Router) {
    this.session = this.filesService.session || this.session;
  }

  storeCategories = [
    { id: Category.MINIME, label: 'Minime' },
    { id: Category.CADET, label: 'Cadet' },
    { id: Category.JUNIOR, label: 'Junior' },
    { id: Category.SENIOR, label: 'Sénior' },
    { id: Category.MASTER, label: 'Master' },
  ];

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  openCamera() {
    this.router.navigate(['/camera/preview']);
  }
}
