import {
  AfterViewInit,
  Component,
  computed,
  effect,
  output,
  Signal,
  signal,
  TemplateRef,
  WritableSignal
} from '@angular/core';
import {OpenModalsCloseParams, OpenModalsParams} from './type/OpenModalsParams';
import {NgForOf, NgTemplateOutlet} from '@angular/common';
import {ButtonComponent} from '../button/button.component';
import {jamClose} from '@ng-icons/jam-icons';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ContainerComponent} from '../container/container.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgForOf,
    ButtonComponent,
    ContainerComponent
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  animations: [
    trigger('fade', [
      state('true', style(
          {
            opacity: 1,
            filter: 'blur(0px)'
          }
        )
      ),
      state('false', style(
          {
            opacity: 0,
            filter: 'blur(10px)'
          }
        )
      ),
      transition('true <=> false', [
        animate('300ms ease-in-out')
      ])
    ])
    ,
    trigger('slide', [
      state('true',
        style(
          {
            transform: 'translateY(0)'
          }
        )
      ),
      state('false',
        style(
          {
            transform: 'translateY(100%)'
          }
        )
      ),
      transition('true <=> false', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class ModalComponent implements AfterViewInit {
  params: WritableSignal<OpenModalsParams | null> = signal<OpenModalsParams | null>(null)
  onClose = output<boolean>()
  onDismiss = output<void>();
  animationDuration = 300;
  open = signal<boolean>(false);

  animationState = computed<string>(() => {
    return this.open() ? 'open' : 'closed';
  });


  constructor() {
    effect(() => {
      console.log('ModalComponent', this.open());
    });
  }

  displayCloseButton = computed<boolean>(() => {
    return this.params()?.closeable instanceof Object ? (this.params()?.closeable as OpenModalsCloseParams).closeButton : this.params()?.closeable as boolean;
  })

  maskClose = computed<boolean>(() => {
    return this.params()?.closeable instanceof Object ? (this.params()?.closeable as OpenModalsCloseParams).maskClose : this.params()?.closeable as boolean;
  })

  ngAfterViewInit(): void {
    this.open.set(true)
  }

  contentArray = computed<string[]>(() => {
    return this.params()?.content instanceof Array ? this.params()?.content as string[] : [];
  });

  contentTemplate: Signal<TemplateRef<any> | null> = computed<TemplateRef<any> | null>(() => {
      return this.params()?.content instanceof TemplateRef ? this.params()?.content as TemplateRef<any> : null;
    }
  )
  protected readonly jamClose = jamClose;
}
