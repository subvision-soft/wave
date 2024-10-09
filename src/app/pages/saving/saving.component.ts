import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Session} from '../../models/session';
import {FilesService} from '../../services/files.service';
import {SelectComponent} from "../../components/select/select.component";
import {HeaderComponent} from "../../components/header/header.component";

@Component({
  selector: 'app-saving',
  templateUrl: './saving.component.html',
  styleUrls: ['./saving.component.scss'],
  imports: [
    SelectComponent,
    HeaderComponent
  ],
  standalone: true
})
export class SavingComponent {
  get session(): Session {
    return this._session;
  }

  private _session: Session = {
    date: new Date(),
    description: '',
    title: '',
    users: [],
    teams: [],
  };

  constructor(
    private route: ActivatedRoute,
    private filesService: FilesService
  ) {
    const url = this.route.snapshot.queryParams['url'];
    if (url) {
      this.filesService.openFileByUrl(url, true).then((result) => {
        this.filesService.session = result;
        this.filesService.path = url;
        this._session = result;
      });
    }
  }
}
