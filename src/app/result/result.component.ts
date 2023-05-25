import { Component, OnInit } from '@angular/core';
import { PlastronService } from '../plastron.service';
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
  public impacts: any[] = [];
  public total: number = 0;
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
      cv.imshow(this.canvas, cible.image);
      this.impacts = cible.impacts;
      this.total = cible.impacts
        .map((impact: any) => impact.points)
        .reduce((a: number, b: number) => a + b, 0);
      cible.image.delete();
    } catch (error) {
      console.error(error);
    }
  }
}
