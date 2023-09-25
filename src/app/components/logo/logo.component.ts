import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  @HostBinding('style.width') width: string = '20px';

  @Input() set size(size: number) {
    this.width = `${size}px`;
  }
}
