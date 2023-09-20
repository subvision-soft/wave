import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Impact } from '../../models/impact';

@Component({
  selector: 'app-impacts-list',
  templateUrl: './impacts-list.component.html',
  styleUrls: ['./impacts-list.component.scss'],
})
export class ImpactsListComponent {
  protected _impacts: Impact[] = [];
  @Output() public impactsChange = new EventEmitter<Impact[]>();
  @Output() public selectedChange = new EventEmitter<Impact | null>();
  protected _selected: Impact | null = null;

  @Input()
  set selected(impact: Impact | null) {
    this._selected = impact;
  }

  get selected(): Impact | null {
    return this._selected;
  }

  @Input()
  set impacts(impacts: Impact[]) {
    console.log('impacts', impacts);
    this._impacts = impacts;
  }

  get impacts(): Impact[] {
    return this._impacts;
  }

  select = (impact: Impact) => {
    this._selected = impact;
    this.selectedChange.emit(impact);
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
