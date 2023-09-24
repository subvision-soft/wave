import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-text',
  templateUrl: './empty-text.component.html',
  styleUrls: ['./empty-text.component.scss'],
})
export class EmptyTextComponent {
  @Input() text: string = 'Aucun élément à afficher';
  @Input() icon: string = 'jamGhost';
}
