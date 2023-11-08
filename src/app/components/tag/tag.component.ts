import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent {
  @HostBinding('class') @Input() color: 'primary' | 'secondary' = 'primary';
}
