import { Component } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { Location } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-scan-server',
  templateUrl: './scan-server.component.html',
  styleUrl: './scan-server.component.scss',
  standalone: true,
  imports: [ZXingScannerModule, HeaderComponent],
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
