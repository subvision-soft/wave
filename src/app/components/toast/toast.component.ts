import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ToastService, ToastTypes } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  @ViewChild('element', { static: false }) progressBar?: ElementRef;

  @HostBinding('class.success') get success() {
    return this.toastService.data.type === ToastTypes.SUCCESS;
  }

  @HostBinding('class.error') get error() {
    return this.toastService.data.type === ToastTypes.ERROR;
  }

  @HostBinding('class.info') get info() {
    return this.toastService.data.type === ToastTypes.INFO;
  }

  @HostBinding('class.warning') get warning() {
    return this.toastService.data.type === ToastTypes.WARNING;
  }

  @HostBinding('class.open') get open() {
    return this.toastService.data.show;
  }

  @HostListener('click') onClick() {
    this.stopCountDown();
  }

  progressInterval: any;

  startDate = new Date();
  endDate = new Date();
  progressWidth: string = '100%';

  updateProgressWidth() {
    this.progressWidth = this.progressInterval
      ? ((this.endDate.getTime() - Date.now()) /
          this.toastService.data.duration) *
          100 +
        '%'
      : '0%';
  }

  constructor(public toastService: ToastService) {
    this.toastService.open.subscribe((data) => {
      if (data.show) {
        this.endDate = new Date(Date.now() + data.duration);
        this.countDown();
      }
    });
  }

  ngOnInit() {}

  countDown() {
    this.stopCountDown(false);
    this.progressInterval = setInterval(() => {
      this.updateProgressWidth();
      if (this.endDate.getTime() < Date.now()) {
        this.stopCountDown();
      }
    }, 50);
  }

  stopCountDown(hide: boolean = true) {
    clearInterval(this.progressInterval);
    if (hide) {
      this.toastService.hide();
      setTimeout(() => {
        if (!this.progressInterval) {
          this.progressWidth = '100%';
        }
      }, 500);
    }
  }
}
