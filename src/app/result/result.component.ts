import { Component, OnInit } from '@angular/core';
import { PlastronService } from '../plastron.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  private frame: any = null;
  private canvas: any = null;

  constructor(
    private plastronService: PlastronService,
    private router: Router
  ) {
    this.frame = this.plastronService.getFrame();
    if (!this.frame) {
      console.error('No frame found');
      this.router.navigate(['camera']);
      return;
    }
  }
  ngOnInit(): void {
    this.canvas = document.getElementById('canvas');
    const cv = (window as any).cv;
    try {
      const cible = this.plastronService.process();
      cv.imshow(this.canvas, cible.image);
    } catch (error) {
      console.error(error);
    }
  }
}
