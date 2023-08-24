import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent {
  @Input() session: any;
  @HostBinding('class') class = 'ripple';
}
