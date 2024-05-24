import { Component, HostBinding } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { ServerService } from '../../services/server.service';

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
      // this.toastService.initiate({
      //   title: 'SERVER.TOASTS.SUCCESS.TITLE',
      //   content: 'SERVER.TOASTS.SUCCESS.CONTENT',
      //   show: true,
      //   type: ToastTypes.SUCCESS,
      //   duration: 1500,
      // });
    }
  }

  @HostBinding('class.connected') private _connected = false;

  openMessageBox = false;
  openScanner: boolean = false;

  constructor(
    private serverService: ServerService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.connected = this.serverService.isConnected();
    serverService.connectionStatus.subscribe((status) => {
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
    this.router
      .navigate(['server-connect'])
      .then(() => {
        console.log('Connecting to server...');
      })
      .catch((error) => {
        console.error('Error connecting to server:', error);
      });
  }

  disconnect() {
    this.serverService.disconnect();
    console.log('Disconnecting from server...');
  }

  messageBoxCallback($event: any) {
    if ($event.btn === 'ok') {
      this.disconnect();
    }
  }
}
