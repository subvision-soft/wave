import { Component, OnInit } from '@angular/core';
import { Impact, PlastronService, Zone } from '../services/plastron.service';
import { Router } from '@angular/router';
import { SegmentedButtonItem } from '../segmented-button/segmented-button.component';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  private frame: any = null;
  private canvas: any = null;
  protected time: number = 0;
  protected selected: Impact | null = null;
  protected imagePreview: boolean = false;

  public impacts: any[] = [
    {
      points: 456,
      angle: 100.6763797345331,
      zone: Zone.CENTER,
    },
    {
      points: 426,
      angle: 103.43445377384366,
      zone: Zone.BOTTOM_RIGHT,
    },
    {
      points: 495,
      angle: 155.98756431301382,
      zone: Zone.BOTTOM_LEFT,
    },
    {
      points: 474,
      angle: 156.06791089729842,
      zone: Zone.TOP_RIGHT,
    },
    {
      points: 0,
      angle: 63.07817692394753,
      zone: Zone.TOP_LEFT,
      distance: 55,
    },
  ];
  public total: number = 0;
  public epreuve: string = 'precision';

  get precision(): boolean {
    return this.epreuve === 'precision';
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

  constructor(
    private plastronService: PlastronService,
    private router: Router
  ) {
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

  togglePreview() {
    this.imagePreview = !this.imagePreview;
  }
}
