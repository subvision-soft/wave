import {Component, HostBinding, input} from '@angular/core';

@Component({
  selector: '[waveContainer]',
  standalone: true,
  imports: [],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export class ContainerComponent {

  @HostBinding('style.max-width') get maxWidthStyle() {
    return this.maxWidth();
  }

  maxWidth = input('auto');


}
