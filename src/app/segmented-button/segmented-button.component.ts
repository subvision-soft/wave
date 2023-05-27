import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-segmented-button',
  templateUrl: './segmented-button.component.html',
  styleUrls: ['./segmented-button.component.scss'],
})
export class SegmentedButtonComponent {
  public _selected: string = '';
  @Input() public items: SegmentedButtonItem[] = [];
  @Output() public selectedChange = new EventEmitter<string>();

  @Input()
  set selected(selected: string) {
    this._selected = selected;
  }

  onClick = (item: SegmentedButtonItem) => {
    if (item.onClick) {
      item.onClick();
    }
    this._selected = item.key;
    this.selectedChange.emit(this._selected);
  };
}

export class SegmentedButtonItem {
  constructor(
    public label: string,
    public key: string,
    public onClick: Function
  ) {}
}
