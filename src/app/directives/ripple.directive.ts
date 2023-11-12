import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ripple]',
})
export class RippleDirective {
  hostEl;

  constructor(private renderer: Renderer2, el: ElementRef) {
    this.hostEl = el.nativeElement;
    this.hostEl.classList.add('ripple-container');
  }

  @HostListener('click', ['$event']) onClick(e: MouseEvent) {
    console.log(e);

    let ink, d, x, y;
    if (this.hostEl.querySelector('.ink') === null) {
      ink = this.renderer.createElement('span');
      this.renderer.addClass(ink, 'ink');
      this.renderer.appendChild(this.hostEl, ink);
    }

    ink = this.hostEl.querySelector('.ink');
    this.renderer.appendChild(this.hostEl, ink);
    this.renderer.removeClass(ink, 'animate');

    if (!ink.offsetHeight && !ink.offsetWidth) {
      d = Math.max(this.hostEl.offsetWidth, this.hostEl.offsetHeight);
      this.renderer.setStyle(ink, 'width', d + 'px');
      this.renderer.setStyle(ink, 'height', d + 'px');
    }

    x =
      e.pageX - this.hostEl.getBoundingClientRect().left - ink.offsetWidth / 2;
    y =
      e.pageY - this.hostEl.getBoundingClientRect().top - ink.offsetHeight / 2;

    console.log(
      'x',
      `${e.pageX} - ${this.hostEl.getBoundingClientRect().left} - ${
        ink.offsetWidth / 2
      } = ${x}`
    );
    console.log(
      'y',
      `${e.pageY} - ${this.hostEl.getBoundingClientRect().top} - ${
        ink.offsetHeight / 2
      } = ${x}`
    );
    // debugger;
    this.renderer.setStyle(ink, 'top', y + 'px');
    this.renderer.setStyle(ink, 'left', x + 'px');
    this.renderer.addClass(ink, 'animate');
  }
}
