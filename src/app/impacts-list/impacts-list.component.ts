import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Impact } from '../services/plastron.service';

@Component({
  selector: 'app-impacts-list',
  templateUrl: './impacts-list.component.html',
  styleUrls: ['./impacts-list.component.scss'],
})
export class ImpactsListComponent {
  protected _impacts: Impact[] = [];
  @Output() public impactsChange = new EventEmitter<Impact[]>();

  @Input()
  set impacts(impacts: Impact[]) {
    console.log('impacts', impacts);
    this._impacts = impacts;
  }

  get impacts(): Impact[] {
    return this._impacts;
  }

  duplicate = (impact: Impact) => {
    const newImpact = new Impact(impact.points, impact.zone, impact.angle);
    this._impacts.push(newImpact);
    this.impactsChange.emit(this._impacts);
  };

  remove = (impact: Impact) => {
    const index = this._impacts.indexOf(impact);
    this._impacts.splice(index, 1);
    this.impactsChange.emit(this._impacts);
  };

  groupByZone = (impacts: Impact[]) => {
    const groups: any = {};
    impacts.forEach((impact) => {
      if (!groups[impact.zone]) {
        groups[impact.zone] = [];
      }
      groups[impact.zone].push(impact);
    });
    return groups;
  };
}
