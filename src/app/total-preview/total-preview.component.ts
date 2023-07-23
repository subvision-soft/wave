import { Component, Input } from '@angular/core';
import { Impact } from '../services/plastron.service';

@Component({
  selector: 'app-total-preview',
  templateUrl: './total-preview.component.html',
  styleUrls: ['./total-preview.component.scss'],
})
export class TotalPreviewComponent {
  @Input() public impacts: Impact[] = [];
  @Input() public time: number = 0;
  @Input() public epreuve: string = 'precision';

  get precision(): boolean {
    return this.epreuve === 'precision';
  }

  get biathlon(): boolean {
    return this.epreuve === 'biathlon';
  }

  get superBiathlon(): boolean {
    return this.epreuve === 'superBiathlon';
  }

  get total(): number {
    if (this.precision) {
      return this.tirsValides.reduce((acc, impact) => acc + impact.points, 0);
    } else if (this.biathlon) {
      const number =
        (this.tirsValides.reduce((acc, impact) => acc + impact.points, 0) -
          this.time * 2) *
        3;
      return number > 0 ? number : 0;
    }
    return 0;
  }

  get tirsValides(): Impact[] {
    if (this.precision) {
      //On garde les 10 moins bons impacts
      let impacts = this.impacts
        .sort((a, b) => a.points - b.points)
        .slice(0, 9);
      let zones: any = {};
      zones = impacts.reduce((acc, impact) => {
        const zone = zones[impact.zone] || [];
        zone.push(impact);
        zones[impact.zone] = zone;
        return zones;
      });
      impacts = [];
      //On garde les 2 meilleurs impacts de chaque visuels
      Object.keys(zones).map((zone) => {
        impacts.push(
          ...zones[zone]
            .sort((a: Impact, b: Impact) => b.points - a.points)
            .slice(0, 2)
        );
      });
      return impacts;
    } else if (this.biathlon) {
      //On garde les 3 moins bons impacts
      let impacts = this.impacts
        .sort((a, b) => a.points - b.points)
        .slice(0, 3);
      let zones: any = {};
      zones = impacts.reduce((acc, impact) => {
        const zone = zones[impact.zone] || [];
        zone.push(impact);
        zones[impact.zone] = zone;
        return zones;
      });
      impacts = [];
      //On garde le meilleur impact de chaque visuels
      Object.keys(zones).map((zone) => {
        impacts.push(
          ...zones[zone]
            .sort((a: Impact, b: Impact) => b.points - a.points)
            .slice(0, 1)
        );
      });
      return impacts;
    } else if (this.superBiathlon) {
    }
    return [];
  }
}
