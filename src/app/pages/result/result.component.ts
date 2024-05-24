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
import { AppSettings } from '../../utils/AppSettings';
import { User } from '../../models/user';
import { ServerService } from '../../services/server.service';
import { Category } from '../../models/category';
import { StageModel } from '../../models/stage.model';

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
      if (AppSettings.ENABLE_LOCAL_SAVE) {
        this.router.navigate(['/sessions']);
      } else {
        this.openSaveForm = true;
      }
    }),
  ];

  openSaveForm: boolean = false;

  get epreuve(): Event {
    console.log('Getting epreuve', this.target.event);
    return this.target.event;
  }

  set epreuve(value: Event) {
    console.log('Setting epreuve', value);
    this.target.event = value;
    this.loadCompetitors();
  }

  get stage(): string {
    return this.target.stage || '';
  }

  set stage(value: string) {
    this.target.stage = value;
    this.loadCompetitors();
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
  protected saving: boolean = false;
  protected editable = true;

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

  stageStore: StageModel[] = [];

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
    event: Event.PRECISION,
    user: '',
    shotsTooCloseCount: 0,
    badArrowExtractionsCount: 0,
    targetSheetNotTouchedCount: 0,
    departureSteal: false,
    armedBeforeCountdown: false,
    stage: undefined,
    timeRanOut: false,
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
    public activatedRoute: ActivatedRoute,
    private serverService: ServerService,
    private server: ServerService
  ) {
    if (server.isConnected()) {
      this.loadCompetitors();
      this.loadStages();
      this.loadEvents();
    }
  }

  get competitorsStore(): any[] {
    return this.competitors?.map((competitor) => ({
      label: `${competitor.id} - ${competitor.firstname} ${competitor.lastname}`,
      id: competitor.id,
    }));
  }

  loadEvents() {
    this.serverService.getEvents().then((events) => {
      this.selectStore = events.map((event) => {
        return {
          label: event.label,
          id: event.value,
        };
      });
    });
  }

  loadCompetitors() {
    this.serverService
      .getCompetitors(this.target.event, this.target.stage)
      .then((competitors) => {
        this.competitors = competitors.map((competitor) => {
          return {
            id: competitor.id.toString(),
            firstname: competitor.firstName,
            lastname: competitor.lastName,
            category: Category[competitor.category as keyof typeof Category],
            targets: [],
          };
        });
        if (
          this.selectedCompetitor &&
          !this.competitors.find(
            (competitor) => competitor.id === this.selectedCompetitor
          )
        ) {
          this.selectedCompetitor = undefined;
        }
      });
  }

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
            this.router.navigate(['/camera']);
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
              ...this.target,
              image: base64,
              impacts: cible.impacts,
              total: cible.impacts
                .map((impact: any) => impact.score)
                .reduce((a: number, b: number) => a + b, 0),
              date: new Date(),
              time: 0,
              event: Event.PRECISION,
              user: '',
            };
            this.impacts = cible.impacts;
            this.total = cible.impacts
              .map((impact: any) => impact.score)
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
            // this.router.navigate(['/camera']);
            console.log('Error while processing image', JSON.stringify(error));
            console.error(error);
          }
        }
      });
  }

  save() {
    this.saving = true;
    if (!AppSettings.ENABLE_LOCAL_SAVE) {
      console.log('Saving to server', this.uploadTarget);
      this.serverService.postTarget(this.uploadTarget).then((res) => {
        if (res.ok) {
          this.saving = false;
          this.toastService.initiate({
            title: 'Cible enregistrée',
            content: 'La cible a bien été enregistrée',
            type: ToastTypes.SUCCESS,
            show: true,
            duration: 3000,
          });
          this.router.navigate(['/camera']);
        } else {
          this.toastService.initiate({
            title: 'Erreur',
            content:
              "Une erreur est survenue lors de l'enregistrement de la cible",
            type: ToastTypes.ERROR,
            show: true,
            duration: 3000,
          });
          this.saving = false;
        }
      });
    }
  }

  get uploadTarget(): any {
    return {
      time: this.target.time,
      date: this.target.date,
      competitorId: this.selectedCompetitor,
      id: null,
      pictureBase64: this.target.image,
      impacts: this.target.impacts,
      event: this.epreuve,
      shotsTooCloseCount: this.target.shotsTooCloseCount,
      badArrowExtractionsCount: this.target.badArrowExtractionsCount,
      targetSheetNotTouchedCount: this.target.targetSheetNotTouchedCount,
      departureSteal: this.target.departureSteal,
      armedBeforeCountdown: this.target.armedBeforeCountdown,
      timeRanOut: this.target.timeRanOut,
      stage: this.superBiathlon ? this.target.stage : undefined,
    };
  }

  togglePreview() {
    this.imagePreview = !this.imagePreview;
  }

  protected readonly pluck = pluck;
  competitors: User[] = [];
  selectedCompetitor?: string;

  get showChrono() {
    console.log(this.superBiathlon || this.biathlon);
    return (this.superBiathlon || this.biathlon) && !this.saving;
  }

  protected readonly Event = Event;

  private loadStages() {
    this.serverService.getStages().then((stages) => {
      this.stageStore = stages;
    });
  }
}
