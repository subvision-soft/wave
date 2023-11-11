import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ParserCallback, RSSEntry } from 'rss-parser';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';

@Injectable()
export class RSSParserService {
  constructor(private http: HttpClient) {}

  parseString(xml: string, callback: ParserCallback) {
    let parseString = xml2js.parseString;
    parseString(xml, (err, result: any) => {
      callback(err, result.rss.channel[0].item);
    });
  }

  parseURL(url: string) {
    return new Observable<RSSEntry[]>((subscriber) => {
      const requestOptions: Object = {
        observe: 'body',
        responseType: 'text',
      };
      this.http
        .get<any>('https://proxy.cors.sh/' + url, requestOptions)
        .subscribe((data) => {
          return this.parseString(data, (err, parsed) => {
            if (err) {
              subscriber.error(err);
            } else {
              subscriber.next(parsed);
            }
            subscriber.complete();
          });
        });
    });
  }
}
