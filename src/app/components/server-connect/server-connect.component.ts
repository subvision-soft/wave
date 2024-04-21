import { Component, HostBinding } from '@angular/core';
import { ServerConnectService } from '../../services/server-connect.service';

@Component({
  selector: 'app-server-connect',
  templateUrl: './server-connect.component.html',
  styleUrl: './server-connect.component.scss',
})
export class ServerConnectComponent {
  @HostBinding('class.connected') connected = false;

  openMessageBox = false;
  openScanner: boolean = false;

  constructor(private serverConnectService: ServerConnectService) {
    serverConnectService.connectionStatus.subscribe((status) => {
      this.connected = status;
    });
  }

  onClick() {
    if (this.connected) {
      this.openMessageBox = true;
    } else {
      this.connect();
    }
  }

  connect() {
    this.openScanner = true;
    console.log('Connecting to server...');
  }

  scanComplete(data: any) {
    const stringData = data?.text;
    if (!!stringData) {
      fetch(`${stringData}/is-wave-db-alive`).then(() => {
        this.serverConnectService.connect(stringData);
      });
    }
  }

  disconnect() {
    this.serverConnectService.disconnect();
    console.log('Disconnecting from server...');
  }

  messageBoxCallback($event: any) {
    if ($event.btn === 'ok') {
      this.disconnect();
    }
  }
}
