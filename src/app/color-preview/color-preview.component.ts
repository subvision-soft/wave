import { Component } from '@angular/core';
import { ThemeColorService } from '../services/theme-color.service';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-color-preview',
  templateUrl: './color-preview.component.html',
  styleUrls: ['./color-preview.component.scss'],
})
export class ColorPreviewComponent {
  _color: string = '#1677ff';
  colors: any = {};

  constructor(private themeColor: ThemeColorService) {
    this.colors = this.themeColor.setCssVariables(this.color);
  }

  onCompare(_left: KeyValue<any, any>, _right: KeyValue<any, any>): number {
    return 1;
  }

  ngOnInit(): void {}

  get color(): string {
    return this._color;
  }

  set color(color: string) {
    console.log('color', color);
    this._color = color;
    this.colors = this.themeColor.setCssVariables(this.color);
  }
}
