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
import { RSSParserService } from '../../services/rss-parser.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  open: boolean = false;
  @ViewChild('app-page', { static: true }) el: ElementRef | undefined;
  logoSize: number = 50;

  epubFiles: string[] = [];

  actualites: any[] = [];

  private readonly _url =
    'https://createfeed.fivefilters.org/extract.php?url=https%3A%2F%2Ftirsub.ffessm.fr%2F&item=.commissionpage-news-slider-slide&item_title=.commissionpage-news-slider-slide-caption-title&item_date=.post-date&item_date_format=d%2Fm%2FY+H%3Ai&item_image=.commissionpage-news-slider-slide-image%3Eimg&max=5&order=document&guid=0';

  toLocalDate(date: string) {
    return new Date(date).toLocaleDateString('fr');
  }

  getMediaSource(feedItem: any) {
    return feedItem['media:content'][0]['$']['url'];
  }

  constructor(
    private historyService: HistoryService,
    private router: Router,
    private filesService: FilesService,
    private rssParserService: RSSParserService
  ) {
    this.rssParserService.parseURL(this._url).subscribe((data) => {
      this.actualites = data;
    });
    filesService.clearTarget();
    filesService.clearSession();
    const appPage = document.getElementById('app-page');
    appPage?.addEventListener('scroll', (event) => {
      // @ts-ignore
      let scrollTop = event.target.scrollTop / 30;
      scrollTop = scrollTop > 1 ? 1 : scrollTop;
      this.logoSize = 30 + 20 * (1 - scrollTop);
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

  openActualite(actualite: any) {
    window.open(actualite.link[0], '_blank');
  }
}
