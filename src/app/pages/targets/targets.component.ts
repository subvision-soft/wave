import { Component } from '@angular/core';
import { Target } from '../../models/target';
import { Session } from '../../models/session';
import { Category } from '../../models/category';
import { FilesService } from '../../services/files.service';
import { Event } from '../../models/event';

@Component({
  selector: 'app-targets',
  templateUrl: './targets.component.html',
  styleUrls: ['./targets.component.scss'],
})
export class TargetsComponent {
  searchValue = '';
  openCreateTarget = false;

  get targets() {
    return this.session.users.flatMap((user) => {
      return user.targets || [];
    });
  }

  getUserById(userId: string) {
    return this.session.users.find((u) => u.id === userId);
  }

  segmentedButtonItems = [
    {
      label: 'Tous',
      key: 'all',
      onClick: () => {},
    },
    {
      label: 'Précision',
      key: 'precision',
      onClick: () => {},
    },
    {
      label: 'Biathlon',
      key: 'biathlon',
      onClick: () => {},
    },
    {
      label: 'Super biathlon',
      key: 'super-biathlon',
      onClick: () => {},
    },
    {
      label: 'Saisie libre',
      key: 'saisie-libre',
      onClick: () => {},
    },
  ];
  selectedSegmentedButton = 'all';

  menuActions = [];
  timeoutLongPress: Date = new Date();

  selectedTargets: any[] = [];

  session: Session = {
    title: 'Rennes',
    description: 'Description 1',
    date: new Date(),
    users: [
      {
        id: '1',
        firstname: 'User',
        lastname: '1',
        category: Category.SENIOR,
        targets: [
          {
            impacts: [],
            event: Event.SUPER_BIATHLON,
            total: 0,
            time: 0,
            date: new Date(),
            user: '1',
            image: '',
          },
        ],
      },
    ],
    teams: [],
  };

  constructor(private filesService: FilesService) {
    this.session = this.filesService.session || this.session;
  }

  storeCategories = [
    { id: Category.MINIME, label: 'Minime' },
    { id: Category.CADET, label: 'Cadet' },
    { id: Category.JUNIOR, label: 'Junior' },
    { id: Category.SENIOR, label: 'Sénior' },
    { id: Category.MASTER, label: 'Master' },
  ];

  isTargetSelected(target: Target): boolean {
    return this.selectedTargets.includes(target);
  }

  onLongPress(event: any, target: Target) {
    this.timeoutLongPress = new Date();
    if (this.isTargetSelected(target)) return;
    this.selectedTargets.push(target);
  }

  targetClick(target: Target) {
    if (new Date().getTime() - this.timeoutLongPress.getTime() < 500) return;
    if (this.selectedTargets.length > 0) {
      if (this.isTargetSelected(target)) {
        this.selectedTargets = this.selectedTargets.filter((u) => u !== target);
      } else {
        this.selectedTargets.push(target);
      }
    } else {
      // Ouvrir page target
    }
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }
}
