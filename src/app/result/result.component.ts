import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { Impact, PlastronService, Zone } from '../services/plastron.service';
import { SegmentedButtonItem } from '../segmented-button/segmented-button.component';
import { pluck } from 'rxjs';

@Pipe({ name: 'pluck' })
export class PluckPipe implements PipeTransform {
  transform(value: any[], key: string): any {
    return value.map((value) => {
      if (value.amount === 1) return value[key];
      return value[key] + '×' + value.amount;
    });
  }
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  private frame: any = null;
  private canvas: any = null;
  protected time: number = 0;
  protected _selected: Impact | null = null;
  @Output() selectedChange = new EventEmitter<Impact | null>();
  protected _selectedIndex = 0;
  @Output() selectedIndexChange = new EventEmitter<number>();
  protected imagePreview: boolean = false;
  protected saving: boolean = false;

  selectStore: any[] = [
    {
      label: 'Saisie libre',
      id: 'saisieLibre',
    },
    {
      label: 'Précision',
      id: 'precision',
    },
    {
      label: 'Biathlon',
      id: 'biathlon',
    },
    {
      label: 'Super‑biathlon',
      id: 'superBiathlon',
    },
  ];

  multipleStore: any[] = [
    {
      label: '×1',
      id: 1,
    },
    {
      label: '×2',
      id: 2,
    },
    {
      label: '×3',
      id: 3,
    },
    {
      label: '×4',
      id: 4,
    },
    {
      label: '×5',
      id: 5,
    },
  ];

  set selected(value: Impact | null) {
    this._selected = value;
    this._selectedIndex = this._impacts.findIndex((impact) => impact === value);
    this.selectedChange.emit(value);
  }

  set selectedIndex(value: number) {
    this._selectedIndex = value;
    this._selected = this._impacts[value];
    this.selectedIndexChange.emit(value);
  }

  get selectedIndex(): number {
    return this._selectedIndex;
  }

  get selected(): Impact | null {
    return this._selected;
  }

  public _impacts: any[] = [
    {
      points: 456,
      angle: 100.6763797345331,
      zone: Zone.CENTER,
      amount: 1,
    },
    {
      points: 426,
      angle: 103.43445377384366,
      zone: Zone.BOTTOM_RIGHT,
      amount: 1,
    },
    {
      points: 495,
      angle: 155.98756431301382,
      zone: Zone.BOTTOM_LEFT,
      amount: 1,
    },
    {
      points: 474,
      angle: 156.06791089729842,
      zone: Zone.TOP_RIGHT,
      amount: 1,
    },
    {
      points: 0,
      angle: 63.07817692394753,
      zone: Zone.TOP_LEFT,
      distance: 55,
      amount: 1,
    },
    {
      points: 0,
      angle: 63.07817692394753,
      zone: Zone.TOP_RIGHT,
      distance: 55,
      amount: 1,
    },
    {
      points: 450,
      angle: 63.07817692394753,
      zone: Zone.TOP_LEFT,
      distance: 55,
      amount: 1,
    },
    {
      points: 568,
      angle: 63.07817692394753,
      zone: Zone.CENTER,
      distance: 55,
      amount: 1,
    },
    {
      points: 411,
      angle: 63.07817692394753,
      zone: Zone.TOP_LEFT,
      distance: 55,
      amount: 1,
    },
  ];
  public total: number = 0;
  public epreuve: string = 'biathlon';

  get precision(): boolean {
    return this.epreuve === 'precision';
  }

  get impacts(): any[] {
    return [...this._impacts];
  }

  set impacts(value: any[]) {
    console.log('set impacts', value);
    this._impacts = [...value];
  }

  get biathlon(): boolean {
    return this.epreuve === 'biathlon';
  }

  get superBiathlon(): boolean {
    return this.epreuve === 'superBiathlon';
  }

  public itemsSegmented: SegmentedButtonItem[] = [
    new SegmentedButtonItem('Précision', 'precision', () => {
      console.log('Camera');
    }),
    new SegmentedButtonItem('Biathlon', 'biathlon', () => {
      console.log('Gallery');
    }),
    new SegmentedButtonItem('Super-biathlon', 'superBiathlon', () => {
      console.log('Gallery');
    }),
  ];

  constructor(private plastronService: PlastronService) {
    this.frame = this.plastronService.getFrame();
    if (!this.frame) {
      console.error('No frame found');
      // this.router.navigate(['camera']);
      return;
    }
  }

  ngOnInit(): void {
    this.canvas = document.getElementById('canvas');
    const cv = (window as any).cv;
    try {
      const cible = this.plastronService.process();
      cv.imshow('canvas', cible.image);
      this.impacts = cible.impacts;
      this.total = cible.impacts
        .map((impact: any) => impact.points)
        .reduce((a: number, b: number) => a + b, 0);
      cible.image.delete();
    } catch (error) {
      console.error(error);
    }
  }

  save() {
    this.saving = true;
  }

  togglePreview() {
    this.imagePreview = !this.imagePreview;
  }

  protected readonly pluck = pluck;
}
