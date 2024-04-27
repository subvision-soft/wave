import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FilesService } from '../../services/files.service';
import { HistoryService } from '../../services/history.service';
import { Router } from '@angular/router';
import { RSSParserService } from '../../services/rss-parser.service';
import { AppSettings } from '../../utils/AppSettings';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  open: boolean = false;
  @ViewChild('app-page', { static: true }) el: ElementRef | undefined;

  actualitesLoading: boolean = true;

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
    this.rssParserService.parseURL(this._url).subscribe(
      (data) => {
        this.actualites = data;
      },
      undefined,
      () => {
        this.actualitesLoading = false;
      }
    );
    filesService.clearTarget();
    filesService.clearSession();
  }

  get seances(): string[] {
    let map = this.historyService.history
      ?.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .map((history) => history.url);
    map = map?.slice(0, 6);
    return map;
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

  protected readonly AppSettings = AppSettings;
}
