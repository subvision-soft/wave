import {Component, Input} from '@angular/core';
import {NgIcon} from "@ng-icons/core";

@Component({
  selector: 'app-empty-text',
  templateUrl: './empty-text.component.html',
  styleUrls: ['./empty-text.component.scss'],
  imports: [
    NgIcon
  ],
  standalone: true
})
export class EmptyTextComponent {
  @Input() text: string = 'Aucun élément à afficher';
  @Input() icon: string = 'jamGhost';
}
