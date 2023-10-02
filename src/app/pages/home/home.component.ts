import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FilesService } from '../../services/files.service';
import { HistoryService } from '../../services/history.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  open: boolean = false;
  @ViewChild('app-page', { static: true }) el: ElementRef | undefined;
  logoSize: number = 30;

  epubFiles: string[] = [];

  actualites: any[] = [];

  private _seances: string[] = [];

  constructor(
    private filesService: FilesService,
    private historyService: HistoryService,
    private router: Router
  ) {
    const appPage = document.getElementById('app-page');
    appPage?.addEventListener('scroll', (event) => {
      // @ts-ignore
      let scrollTop = event.target.scrollTop / 30;
      scrollTop = scrollTop > 1 ? 1 : scrollTop;
      this.logoSize = 20 + 10 * (1 - scrollTop);
    });

    appPage?.addEventListener('scrollend', (event) => {
      console.log(event);
      // @ts-ignore
      if (event.target.scrollTop < 30) {
        appPage?.scrollTo({
          top: 0,
        });
      }
    });
  }

  get seances(): string[] {
    console.log(this.historyService.history);
    let map = this.historyService.history
      ?.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .map((history) => history.url);
    map = map?.slice(0, 6);
    return map;
  }

  ngOnInit(): void {
    this.readFiles('');
  }

  readFiles(uri: string) {
    this.filesService.loadFiles(uri).then((files) => {
      console.log(files);
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight
    ) {
      console.log('End');
    }
  }

  openSession(url: string) {
    this.router
      .navigate(['/sessions/session', { url: url }], {
        queryParams: {
          url: url,
        },
      })
      .then((r) => console.log(r));
  }

  protected readonly console = console;
}
