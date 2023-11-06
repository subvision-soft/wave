import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { PlastronService } from '../../services/plastron.service';
import { map, pluck } from 'rxjs';
import { SegmentedButtonItem } from '../../components/segmented-button/segmented-button.component';
import { Impact } from '../../models/impact';
import { Event } from '../../models/event';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService, ToastTypes } from '../../services/toast.service';
import { Target } from '../../models/target';
import { Action } from '../../models/action';
import { FilesService } from '../../services/files.service';

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
  menuActions: Action[] = [
    new Action('Enregistrer', undefined, () => {
      this.filesService.target = this.target;
      this.router.navigate(['/sessions']);
    }),
  ];

  get epreuve(): Event {
    return this.target.event;
  }

  set epreuve(value: Event) {
    this.target.event = value;
  }

  get total(): number {
    return this.target.total;
  }

  set total(value: number) {
    this.target.total = value;
  }

  private frame: any = null;
  private canvas: any = null;
  protected _selected: Impact | null = null;
  @Output() selectedChange = new EventEmitter<Impact | null>();
  protected _selectedIndex = 0;
  @Output() selectedIndexChange = new EventEmitter<number>();
  protected imagePreview: boolean = false;
  protected saving: boolean = true;
  protected editable = true;

  protected base64image: string = '';

  get time(): number {
    return this.target.time;
  }

  set time(value: number) {
    this.target.time = value;
  }

  path: string = '/';

  setPath(value: string[]) {
    this.path = value.join('/');
  }

  selectStore: any[] = [
    {
      label: 'Saisie libre',
      id: Event.SAISIE_LIBRE,
    },
    {
      label: 'Précision',
      id: Event.PRECISION,
    },
    {
      label: 'Biathlon',
      id: Event.BIATHLON,
    },
    {
      label: 'Super‑biathlon',
      id: Event.SUPER_BIATHLON,
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
    this._selectedIndex = this.impacts.findIndex((impact) => impact === value);
    this.selectedChange.emit(value);
  }

  set selectedIndex(value: number) {
    this._selectedIndex = value;
    this._selected = this.impacts[value];
    this.selectedIndexChange.emit(value);
  }

  get selectedIndex(): number {
    return this._selectedIndex;
  }

  get selected(): Impact | null {
    return this._selected;
  }

  target: Target = {
    image: '',
    impacts: [],
    total: 0,
    date: new Date(),
    time: 0,
    event: Event.SAISIE_LIBRE,
    user: '',
  };

  get precision(): boolean {
    return this.epreuve === Event.PRECISION;
  }

  get impacts(): any[] {
    return [...this.target.impacts];
  }

  set impacts(value: any[]) {
    this.target.impacts = [
      ...value.map((impact) => ({
        ...impact,
        amount: impact.amount !== 0 ? impact.amount : 1,
      })),
    ];
  }

  get biathlon(): boolean {
    return this.epreuve === Event.BIATHLON;
  }

  get superBiathlon(): boolean {
    return this.epreuve === Event.SUPER_BIATHLON;
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

  constructor(
    private plastronService: PlastronService,
    private router: Router,
    private toastService: ToastService,
    private filesService: FilesService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('ResultComponent.ngOnInit');
    this.canvas = document.getElementById('canvas');
    this.activatedRoute.paramMap
      .pipe(map(() => window.history.state))
      .subscribe((res) => {
        if (!!res.target) {
          this.target = res.target;

          this.editable = false;
          const img = new Image();
          img.onload = () => {
            this.canvas.getContext('2d').drawImage(img, 0, 0, 1000, 1000);
          };
          img.src = this.target.image;
        } else {
          this.frame = this.plastronService.getFrame();
          if (!this.frame) {
            console.error('No frame found');
            this.toastService.initiate({
              title: 'Erreur',
              content:
                "Une erreur est survenue lors de l'analyse du plastron, vérifiez que la photo est bien cadrée et que le plastron est bien visible. Evitez les reflets et les ombres.",
              type: ToastTypes.ERROR,
              show: true,
              duration: 3000,
            });
            return;
          }
          const cv = (window as any).cv;
          try {
            const cible = this.plastronService.process();

            const canvas = document.getElementById('canvas');
            cv.imshow(canvas, cible.image);
            // @ts-ignore
            const base64 = canvas.toDataURL('image/jpeg', 1.0);
            this.target = {
              image: base64,
              impacts: cible.impacts,
              total: cible.impacts
                .map((impact: any) => impact.points)
                .reduce((a: number, b: number) => a + b, 0),
              date: new Date(),
              time: 0,
              event: Event.SAISIE_LIBRE,
              user: '',
            };
            this.impacts = cible.impacts;
            this.total = cible.impacts
              .map((impact: any) => impact.points)
              .reduce((a: number, b: number) => a + b, 0);
            cible.image.delete();
          } catch (error) {
            this.toastService.initiate({
              title: "Erreur lors de l'analyse de la cible",
              content:
                'Vérifiez que la photo est bien cadrée et que la cible est bien visible. Evitez les reflets et les ombres.',
              type: ToastTypes.ERROR,
              show: true,
              duration: 4000,
            });
            // this.router.navigate(['camera']);

            console.error(error);
          }
        }
      });
  }

  save() {
    this.saving = true;
  }

  togglePreview() {
    this.imagePreview = !this.imagePreview;
  }

  protected readonly pluck = pluck;
}
