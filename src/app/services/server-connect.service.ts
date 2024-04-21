import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServerConnectService {
  public connectionStatus: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  connect(uri: string) {
    this.connectionStatus.next(true);
  }

  disconnect() {
    console.log('Disconnecting from server...');
    this.connectionStatus.next(false);
  }
}
