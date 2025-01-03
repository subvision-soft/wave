import {Component, ElementRef, ViewChild} from '@angular/core';
import {FilesService} from '../../services/files.service';
import {HistoryService} from '../../services/history.service';
import {Router, RouterLink} from '@angular/router';
import {RSSParserService} from '../../services/rss-parser.service';
import {AppSettings} from '../../utils/AppSettings';
import {TagComponent} from '../../components/tag/tag.component';
import {SessionItemComponent} from '../../components/session-item/session-item.component';
import {EmptyTextComponent} from '../../components/empty-text/empty-text.component';
import {TranslateModule} from '@ngx-translate/core';
import {RippleDirective} from '../../directives/ripple.directive';
import {LoadingComponent} from '../../components/loading/loading.component';
import {NgForOf, NgIf} from '@angular/common';
import {LogoComponent} from '../../components/logo/logo.component';
import {HeaderComponent} from '../../components/header/header.component';
import {HttpClient} from '@angular/common/http';
import {EndpointsUtils} from '../../utils/EndpointsUtils';
import {NgIcon} from '@ng-icons/core';
import {iconoirGithub} from '@ng-icons/iconoir';
import {ButtonComponent} from '../../components/button/button.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    TagComponent,
    SessionItemComponent,
    EmptyTextComponent,
    TranslateModule,
    RippleDirective,
    LoadingComponent,
    NgIf,
    LogoComponent,
    HeaderComponent,
    RouterLink,
    NgForOf,
    NgIcon,
    ButtonComponent,
  ],
})
export class HomeComponent {
  open: boolean = false;
  @ViewChild('app-page', {static: true}) el: ElementRef | undefined;

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
    private rssParserService: RSSParserService,
    private httpClient: HttpClient
  ) {
    this.httpClient.get(EndpointsUtils.getPathNews()).subscribe((data: any) => {
        this.actualites = data;
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


  openSession(url: string) {
    this.router
      .navigate(['/sessions/session', {url: url}], {
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
  protected readonly iconoirGithub = iconoirGithub;
}
