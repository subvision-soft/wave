import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [style({ opacity: 0, position: 'absolute', width: '100%' })],
      {
        optional: true,
      }
    ),
    query(
      ':leave',
      [
        style({ opacity: 1 }),
        animate(
          '0.3s',
          style({ opacity: 0, position: 'absolute', width: '100%' })
        ),
      ],
      { optional: true }
    ),
    query(
      ':enter',
      [
        style({ opacity: 0 }),
        animate(
          '0.3s',
          style({ opacity: 1, position: 'relative', width: '100%' })
        ),
      ],
      { optional: true }
    ),
  ]),
]);
