import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

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

  actualites: any[] = [
    {
      id: 1,
      name: 'Open International de Caen',
      date: new Date(),
    },
    {
      id: 1,
      name: 'Open International de Caen',
      date: new Date(),
    },
    {
      id: 1,
      name: 'Open International de Caen',
      date: new Date(),
    },
    {
      id: 1,
      name: 'Open International de Caen',
      date: new Date(),
    },
    {
      id: 1,
      name: 'Open International de Caen',
      date: new Date(),
    },
  ];

  seances: any[] = [
    {
      id: 1,
      name: 'Rennes 2022',
      description: 'Seance 1',
      date: new Date(),
      numberOfPeople: 28,
    },
    {
      id: 2,
      name: 'Seance 2',
      description: 'Seance 2',
      date: new Date(),
      numberOfPeople: 10,
    },
    {
      id: 1,
      name: 'Seance 1',
      description: 'Seance 1',
      date: new Date(),
      numberOfPeople: 10,
    },
    {
      id: 2,
      name: 'Seance 2',
      description: 'Seance 2',
      date: new Date(),
      numberOfPeople: 10,
    },
    {
      id: 1,
      name: 'Seance 1',
      description: 'Seance 1',
      date: new Date(),
      numberOfPeople: 10,
    },
    {
      id: 2,
      name: 'Seance 2',
      description: 'Seance 2',
      date: new Date(),
      numberOfPeople: 10,
    },
    {
      id: 1,
      name: 'Seance 1',
      description: 'Seance 1',
      date: new Date(),
      numberOfPeople: 10,
    },
    {
      id: 2,
      name: 'Seance 2',
      description: 'Seance 2',
      date: new Date(),
      numberOfPeople: 10,
    },
    {
      id: 1,
      name: 'Seance 1',
      description: 'Seance 1',
      date: new Date(),
      numberOfPeople: 10,
    },
  ];

  constructor() {
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

  ngOnInit(): void {
    this.readFiles('');
  }

  readFiles(uri: string) {
    const scope = this;
    Filesystem.readdir({
      path: uri,
      directory: Directory.ExternalStorage,
    })
      .then((result) => {
        for (const file of result.files) {
          console.log(JSON.stringify(file));
          if (file.type === 'file') {
            this.epubFiles.push(file.uri);
          } else {
            scope.readFiles(uri + '/' + file.name);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    console.log(event.target.offsetHeight);
    if (
      event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight
    ) {
      console.log('End');
    }
  }
}
