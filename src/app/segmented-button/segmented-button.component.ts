import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-segmented-button',
  templateUrl: './segmented-button.component.html',
  styleUrls: ['./segmented-button.component.scss'],
})
export class SegmentedButtonComponent {
  @Input() public selected?: string = undefined;
  @Input() public items: SegmentedButtonItem[] = [];
  onClick = (item: SegmentedButtonItem) => {
    if (item.onClick) {
      item.onClick();
    }
    this.selected = item.key;
  };
}

export class SegmentedButtonItem {
  constructor(
    public label: string,
    public key: string,
    public onClick: Function
  ) {}
}
