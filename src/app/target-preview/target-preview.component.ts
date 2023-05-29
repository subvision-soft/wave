import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Impact, Zone } from '../services/plastron.service';

@Component({
  selector: 'app-target-preview',
  templateUrl: './target-preview.component.html',
  styleUrls: ['./target-preview.component.scss'],
})
export class TargetPreviewComponent {
  @Input() public impacts: Impact[] = [];
  protected caseSize = 9;
  private cibleSize = 2565;
  private visuelSize = 810;
  private globalPadding = 180;
  protected arrowSize = this.caseSize * 6;
  @Input() public selected: Impact | null = null;
  @Output() public selectedChange = new EventEmitter<Impact | null>();

  sizeToPercent = (size: number) => {
    return (size / this.cibleSize) * 100 + '%';
  };

  pointToDistance = (points: number) => {
    let i;

    for (i = 0; i < 43 && points > 411; i++) {
      points = points - 3;
    }
    for (; i < 48 && points > 411; i++) {
      points = points - 6;
    }
    console.log(i, points);
    return 48 - i;
  };

  getDistance = (impact: Impact) => {
    return (
      ((this.pointToDistance(impact.points) * this.caseSize) / this.arrowSize) *
        100 +
      '%'
    );
  };

  getDistanceFromMm = (distance: number) => {
    return ((distance * this.caseSize) / this.arrowSize) * 100 + '%';
  };

  getBottomAndLeft = (impact: Impact) => {
    let center = {
      x: '0%',
      y: '0%',
    };
    switch (impact.zone) {
      case Zone.TOP_LEFT:
        center.x = this.sizeToPercent(this.globalPadding + this.visuelSize / 2);
        center.y = this.sizeToPercent(
          this.cibleSize - this.globalPadding - this.visuelSize / 2
        );
        break;
      case Zone.TOP_RIGHT:
        center.x = this.sizeToPercent(
          this.cibleSize - this.globalPadding - this.visuelSize / 2
        );
        center.y = this.sizeToPercent(
          this.cibleSize - this.globalPadding - this.visuelSize / 2
        );
        break;
      case Zone.BOTTOM_LEFT:
        center.x = this.sizeToPercent(this.globalPadding + this.visuelSize / 2);
        center.y = this.sizeToPercent(this.globalPadding + this.visuelSize / 2);
        break;
      case Zone.BOTTOM_RIGHT:
        center.x = this.sizeToPercent(
          this.cibleSize - this.globalPadding - this.visuelSize / 2
        );
        center.y = this.sizeToPercent(this.globalPadding + this.visuelSize / 2);
        break;
      case Zone.CENTER:
        center.x = '50%';
        center.y = '50%';
        break;
      default:
        break;
    }
    return {
      bottom: `calc(${center.y} - ${this.sizeToPercent(this.arrowSize / 2)})`,
      left: `calc(${center.x} - ${this.sizeToPercent(this.arrowSize / 2)})`,
    };
  };
  select = (impact: Impact) => {
    console.log('select', impact);
    this.selected = impact;
    this.selectedChange.emit(impact);
  };
}
