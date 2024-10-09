import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Impact} from '../../models/impact';
import {Zone} from '../../models/zone';
import {pluck} from 'rxjs';
import {TagComponent} from "../tag/tag.component";

@Component({
  selector: 'app-results-preview',
  templateUrl: './results-preview.component.html',
  styleUrl: './results-preview.component.scss',
  imports: [
    TagComponent
  ],
  standalone: true
})
export class ResultsPreviewComponent {
  @Input() public impacts: Impact[] = [];
  protected caseSize = 9;
  protected arrowSize = this.caseSize * 6;
  @Input() public selected: Impact | null = null;
  @Output() public selectedChange = new EventEmitter<Impact | null>();

  select = (impact: Impact) => {
    this.selected = impact;
    this.selectedChange.emit(impact);
  };
  zones = [
    {type: Zone.TOP_LEFT, x: '0px', y: '0px'},
    {type: Zone.TOP_RIGHT, x: '0px', y: '0px'},
    {type: Zone.CENTER, x: '0px', y: '0px'},
    {type: Zone.BOTTOM_LEFT, x: '0px', y: '0px'},
    {type: Zone.BOTTOM_RIGHT, x: '0px', y: '0px'},
  ];

  getDisplayPoints = (impact: Impact) => {
    if (impact.amount === 1) return impact.points;
    return impact.points + '×' + impact.amount;
  };

  getImpactsByZone = (zone: Zone) => {
    return this.impacts.filter((impact) => impact.zone === zone);
  };
  protected readonly pluck = pluck;
}
