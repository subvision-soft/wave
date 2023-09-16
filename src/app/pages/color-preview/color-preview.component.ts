import { Component } from '@angular/core';
import { ThemeColorService } from '../../services/theme-color.service';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-color-preview',
  templateUrl: './color-preview.component.html',
  styleUrls: ['./color-preview.component.scss'],
})
export class ColorPreviewComponent {
  _color: string = '#1677ff';
  colors: any[] = [];

  constructor(private themeColor: ThemeColorService) {
    this.colors = [
      '--color-primary-darker',
      '--color-primary',
      '--color-primary-lighter-1',
      '--color-primary-lighter-3',
      '--color-primary-lighter-4',
      '--color-primary-lighter-5',
      '--color-secondary-darker',
      '--color-secondary',
      '--color-secondary-lighter-2',
      '--color-secondary-lighter-3',
      '--color-secondary-lighter-4',
      '--color-secondary-lighter-5',
      '--color-dark1-1',
      '--color-dark1-2',
      '--color-dark1-3',
      '--color-dark1-4',
      '--color-dark1-5',
      '--color-dark1-6',
      '--color-dark2-1',
      '--color-dark2-2',
      '--color-dark2-3',
      '--color-dark2-4',
    ];
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
  }
}
