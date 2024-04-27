import { Component } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-target-form',
  templateUrl: './target-form.component.html',
  styleUrl: './target-form.component.scss',
})
export class TargetFormComponent {
  competitors: User[] = [];
  selectedCompetitors: User[] = [];

  constructor(private serverService: ServerService) {}
}
