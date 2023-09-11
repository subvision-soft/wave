import { Component, HostBinding, Input } from '@angular/core';
import { FileInfo } from '@capacitor/filesystem';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent {
  @Input() file: FileInfo | undefined;
  @Input() goBack: boolean = false;
  @HostBinding('class') class = 'ripple';
}
