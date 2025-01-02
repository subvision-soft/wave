import {Component, effect, ElementRef, HostBinding, input, ViewChild} from '@angular/core';
import {RippleDirective} from '../../directives/ripple.directive';

@Component({
  selector: 'app-capture-button',
  standalone: true,
  imports: [
    RippleDirective
  ],
  templateUrl: './capture-button.component.html',
  styleUrl: './capture-button.component.scss'
})
export class CaptureButton {

  @ViewChild('groupPath') groupPath: ElementRef;

  @HostBinding('class.clickable') clickable = false;


  percentPrev = 0;
  percent = input<number>(0);
  wait = 0;

  timeouts: NodeJS.Timeout[] = [];

//retrieve all path tags with line class

  constructor() {
    effect(() => {
      this.clickable = this.percent() >= 100;

      let paths = this.groupPath.nativeElement.querySelectorAll('path.line');
      if (this.percentPrev !== 0 && this.percent() === 0) {


        this.wait = Date.now() + 500;

        requestAnimationFrame(() => {
          paths.forEach((path: any) => {
              path.style.setProperty('--percent', 0);
            }
          )
        })
      }
      this.timeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });
      if (Date.now() >= this.wait) {
        paths.forEach((path: any, index: number) => {
          path.style.setProperty('--percent', this.percentPrev);
          const time = this.percent() != 0 ? index * 100 : 0;
          const timeout = setTimeout(() => {
            requestAnimationFrame(() => {
              this.timeouts = this.timeouts.filter((t) => t !== timeout);
              path.style.setProperty('--percent', this.percent());
            });
          }, time);
          this.timeouts.push(timeout);
        });
      }


      this.percentPrev = this.percent();
    })
  }


}
