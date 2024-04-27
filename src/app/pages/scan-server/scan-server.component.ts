import { Component } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-scan-server',
  templateUrl: './scan-server.component.html',
  styleUrl: './scan-server.component.scss',
})
export class ScanServerComponent {
  constructor(
    private serverService: ServerService,
    private location: Location
  ) {
    serverService.connectionStatus.subscribe((status) => {
      if (status) {
        this.location.back();
      }
    });
  }

  scanComplete(data: any) {
    if (!!data) {
      this.serverService.connect(data);
    }
  }
}
