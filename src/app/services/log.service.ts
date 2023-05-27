import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  debug(...args: any[]) {
    if (!isDevMode()) {
      return;
    }
    let msg = '';
    for (let i = 0; i < args.length; i++) {
      msg += ' ' + JSON.stringify(args[i]);
    }
    console.log(msg);
  }

  info(...args: any[]) {
    let msg = '';
    for (let i = 0; i < args.length; i++) {
      msg += ' ' + JSON.stringify(args[i]);
    }
    console.log(msg);
  }
}
