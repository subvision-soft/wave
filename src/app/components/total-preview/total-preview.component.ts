import { Component, Input } from '@angular/core';
import { Impact } from '../../models/impact';
import { Event } from '../../models/event';

@Component({
  selector: 'app-total-preview',
  templateUrl: './total-preview.component.html',
  styleUrls: ['./total-preview.component.scss'],
})
export class TotalPreviewComponent {
  public _impacts: Impact[] = [];
  @Input() public time: number = 0;
  @Input() public epreuve: string = 'precision';

  @Input()
  public set impacts(impacts: Impact[]) {
    this._impacts = [];
    for (let i = 0; i < impacts.length; i++) {
      for (let j = 0; j < impacts[i].amount; j++) {
        this._impacts.push({ ...impacts[i] });
      }
    }
  }

  public get impacts(): Impact[] {
    return this._impacts;
  }

  get precision(): boolean {
    return this.epreuve === Event.PRECISION;
  }

  get biathlon(): boolean {
    return this.epreuve === Event.BIATHLON;
  }

  get superBiathlon(): boolean {
    return this.epreuve === Event.SUPER_BIATHLON;
  }

  get saisieLibre(): boolean {
    return this.epreuve === Event.SAISIE_LIBRE;
  }

  get total(): number {
    if (this.precision) {
      const number1 = this.tirsValides;
      return number1.reduce((acc, impact) => acc + impact.score, 0);
    } else if (this.biathlon) {
      const number =
        (this.tirsValides.reduce((acc, impact) => acc + impact.score, 0) -
          this.time * 2) *
        3;
      return number > 0 ? number : 0;
    } else if (this.superBiathlon) {
      const contrats = this.tirsValides.filter(
        (impact) => impact.score >= 471
      ).length;
      const capitalPoints = 5000;
      const tempsReference = 90;
      if (contrats > 3) {
        const time1 = this.time - (contrats - 3) * 3;
        const number = capitalPoints + 3 * (tempsReference - time1);
        return number > 0 ? number : 0;
      }
    } else if (this.saisieLibre) {
      const number1 = this.tirsValides;
      return number1.reduce((acc, impact) => acc + impact.score, 0);
    }
    return 0;
  }

  get tirsValides(): Impact[] {
    if (this.precision) {
      //On garde les 10 moins bons impacts
      let impacts = this._impacts
        .sort((a, b) => a.score - b.score)
        .slice(0, 10);
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
            .sort((a: Impact, b: Impact) => b.score - a.score)
            .slice(0, 2)
        );
      });
      return impacts;
    } else if (this.biathlon) {
      //On garde les 3 moins bons impacts
      let impacts = this._impacts.sort((a, b) => a.score - b.score).slice(0, 3);
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
            .sort((a: Impact, b: Impact) => b.score - a.score)
            .slice(0, 1)
        );
      });
      return impacts;
    } else if (this.superBiathlon) {
      return this.impacts;
    } else if (this.saisieLibre) {
      return this.impacts;
    }
    return [];
  }
}
