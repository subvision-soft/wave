import { Component, HostBinding } from '@angular/core';
import { ServerConnectService } from '../../services/server-connect.service';
import * as console from 'node:console';
import { ToastService, ToastTypes } from '../../services/toast.service';

@Component({
  selector: 'app-server-connect',
  templateUrl: './server-connect.component.html',
  styleUrl: './server-connect.component.scss',
})
export class ServerConnectComponent {
  get connected(): boolean {
    return this._connected;
  }

  set connected(value: boolean) {
    this._connected = value;

    if (value) {
      this.openScanner = false;
      this.toastService.initiate({
        title: 'SERVER.TOASTS.SUCCESS.TITLE',
        content: 'SERVER.TOASTS.SUCCESS.CONTENT',
        show: true,
        type: ToastTypes.SUCCESS,
        duration: 1500,
      });
    }
  }

  @HostBinding('class.connected') private _connected = false;

  openMessageBox = false;
  openScanner: boolean = false;

  constructor(
    private serverConnectService: ServerConnectService,
    private toastService: ToastService
  ) {
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
    if (!!data) {
      fetch(`${data}/is-wave-db-alive`).then(() => {
        this.serverConnectService.connect(data);
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
