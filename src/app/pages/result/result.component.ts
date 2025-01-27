import {Component, EventEmitter, OnInit, Output, Pipe, PipeTransform,} from '@angular/core';
import {PlastronService} from '../../services/plastron.service';
import {map, pluck} from 'rxjs';
import {SegmentedButtonItem} from '../../components/segmented-button/segmented-button.component';
import {Impact} from '../../models/impact';
import {Event} from '../../models/event';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService, ToastTypes} from '../../services/toast.service';
import {Target} from '../../models/target';
import {Action} from '../../models/action';
import {FilesService} from '../../services/files.service';
import {User} from '../../models/user';
import {ServerService} from '../../services/server.service';
import {Category} from '../../models/category';
import {StageModel} from '../../models/stage.model';
import {InputComponent} from '../../components/input/input.component';
import {SelectComponent} from '../../components/select/select.component';
import {ChronoPickerComponent} from '../../components/chrono-picker/chrono-picker.component';
import {MessageBoxComponent} from '../../components/message-box/message-box.component';
import {SwiperItemComponent} from '../../components/swiper-item/swiper-item.component';
import {TargetPreviewComponent} from '../../components/target-preview/target-preview.component';
import {SpinnerComponent} from '../../components/spinner/spinner.component';
import {ResultsPreviewComponent} from '../../components/results-preview/results-preview.component';
import {SwiperComponent} from '../../components/swiper/swiper.component';
import {TotalPreviewComponent} from '../../components/total-preview/total-preview.component';
import {TagComponent} from '../../components/tag/tag.component';
import {HeaderComponent} from '../../components/header/header.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgIf} from '@angular/common';
import {ParametersService} from '../../services/parameters.service';
import {Session} from '../../models/session';
import {compressImage} from '../../utils/image';
import imageCompression from 'browser-image-compression';
import drawImageInCanvas = imageCompression.drawImageInCanvas;

@Pipe({standalone: true, name: 'pluck'})
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
  standalone: true,
  imports: [
    InputComponent,
    SelectComponent,
    ChronoPickerComponent,
    MessageBoxComponent,
    SwiperItemComponent,
    TargetPreviewComponent,
    SpinnerComponent,
    ResultsPreviewComponent,
    SwiperComponent,
    TotalPreviewComponent,
    TagComponent,
    HeaderComponent,
    TranslateModule,
    PluckPipe,
    NgIf,
  ],
})
export class ResultComponent implements OnInit {
  menuActions: Action[] = [
    new Action('Enregistrer', undefined, () => {
      this.openSaveForm = true;
    }),
  ];

  openSaveForm: boolean = false;

  get epreuve(): Event {
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
    user: 0,
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

  get impacts(): Impact[] {
    return [...this.target.impacts];
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

  sessions: Session[] = [];

  constructor(
    private plastronService: PlastronService,
    private router: Router,
    private toastService: ToastService,
    private filesService: FilesService,
    public activatedRoute: ActivatedRoute,
    private serverService: ServerService,
    private server: ServerService,
    private fileService: FilesService,
  ) {
    this.loadCompetitors();
    this.loadStages();

    console.log(this.stageStore)

    if (server.isConnected()) {
      this.loadEvents();
    } else {
      this.loadSessions();
    }
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
    if (this.server.isConnected()) {
      this.serverService
        .getCompetitors(this.target.event, this.target.stage)
        .then((competitors) => {
          this.competitors = competitors.map((competitor) => {
            return {
              id: competitor.id,
              label: `${competitor.id} - ${competitor.firstName} ${competitor.lastName}`,
              firstname: competitor.firstName,
              lastname: competitor.lastName,
              category: Category[competitor.category as keyof typeof Category],
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
      return;
    }
  }

  ngOnInit(): void {
    this.canvas = document.getElementById('canvas');
    this.activatedRoute.paramMap
      .pipe(map(() => window.history.state))
      .subscribe((res) => {
        this.editable = res.edit
        if (!!res.data) {
          this.target = {
            ...this.target,
            image: res.data.image,
            impacts: res.data.impacts.map((impact: Impact, index: number) => {
              impact.amount = impact.amount !== 0 ? impact.amount : 1;
              impact.id = index

              return impact;
            }),
            total: res.data.impacts
              .map((impact: any) => impact.score)
              .reduce((a: number, b: number) => a + b, 0),
            date: new Date(),
            time: 0,
            event: Event.PRECISION,
            user: 0,
          };

          const img = new Image();
          img.onload = () => {
            this.canvas.getContext('2d').drawImage(img, 0, 0, 1000, 1000);
          };
          img.src = this.target.image;
        } else {
          this.toastService.initiate({
            title: 'Erreur',
            content:
              "Une erreur est survenue lors de l'analyse du plastron, vérifiez que la photo est bien cadrée et que le plastron est bien visible. Evitez les reflets et les ombres.",
            type: ToastTypes.ERROR,
            show: true,
            duration: 3000,
          });
          this.router.navigate(['/camera']);

        }
      });
  }

  save() {
    this.saving = true;
    if (!ParametersService.isLocalSave()) {
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
      return;
    }

    this.target.user = this.selectedCompetitor || 0
    this.selectedSession.targets.push(this.target);
    this.fileService.loadSession(this.selectedSession);
    this.fileService.updateSession();
    this.router.navigate(['/camera']);

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
  selectedCompetitor?: number;
  selectedSessionId: string;
  selectedSession: Session;

  get showChrono() {
    return (this.superBiathlon || this.biathlon) && !this.saving;
  }

  protected readonly Event = Event;

  private loadStages(): void {
    if (ParametersService.isLocalSave()) {
      this.stageStore = [
        {
          value: 'qualification',
          label: 'Qualification',
        },
        {
          value: 'quart',
          label: 'Quart',
        },
        {
          value: 'demi',
          label: 'Demi',
        },
        {
          value: 'finale',
          label: 'Finale',
        }
      ];
      return
    }

    this.serverService.getStages().then((stages) => {
      this.stageStore = stages;
    });
  }

  async loadSessions(): Promise<void> {
    this.sessions = await this.fileService.getAllSessions()
    this.competitors = this.sessions.at(0)?.users || []
  }

  changeSession() {
    if (!ParametersService.isLocalSave()) {
      return
    }

    const newSessionIdx = this.sessions.findIndex((session: Session) => session.title === this.selectedSessionId);

    this.selectedSession = this.sessions[newSessionIdx];

    this.competitors = this.selectedSession.users || [];
  }

  protected readonly ParametersService = ParametersService;
}
