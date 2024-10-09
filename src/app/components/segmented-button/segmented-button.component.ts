import {Component, EventEmitter, HostBinding, Input, Output,} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-segmented-button',
  templateUrl: './segmented-button.component.html',
  styleUrls: ['./segmented-button.component.scss'],
  imports: [
    TranslateModule,
    NgForOf
  ],
  standalone: true
})
export class SegmentedButtonComponent {
  public _selected: string = '';
  @Input() public items: SegmentedButtonItem[] = [];
  @Output() public selectedChange = new EventEmitter<string>();

  @HostBinding('style.--active-item-index') get activeItemIndex() {
    return this.items.findIndex((item) => item.key === this._selected);
  }

  @HostBinding('style.--items-count') get itemsCount() {
    return this.items.length;
  }

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
  ) {
  }
}
