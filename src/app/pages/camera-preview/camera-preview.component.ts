import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CameraPreview } from '@capacitor-community/camera-preview';
import { NgxOpenCVService } from '../../../lib/ngx-open-cv.service';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { PlastronService } from '../../services/plastron.service';
import { OpenCVState } from '../../../lib/models';
import { FilesService } from '../../services/files.service';
import { WebcamService } from '../../services/webcam.service';

@Component({
  selector: 'app-camera-preview',
  templateUrl: './camera-preview.component.html',
  styleUrls: ['./camera-preview.component.scss'],
})
export class CameraPreviewComponent implements AfterViewInit, OnDestroy {
  flash: boolean = false;

  get coordinatesPercent(): any {
    return this._coordinatesPercent;
  }

  set coordinatesPercent(value: any) {
    this._coordinatesPercent = value;
    this.path?.nativeElement.setAttribute('d', this.getPath());
  }

  stream: MediaStream | undefined;

  @ViewChild('svg') svg: ElementRef | undefined;
  @ViewChild('path') path: ElementRef | undefined;
  @ViewChild('cameraPreview') cameraPreview: ElementRef | undefined;
  private playing: boolean = true;
  parentHeight: number = 0;
  parentWidth: number = 0;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateParentSize();
  }

  private updateParentSize() {
    this.parentHeight = this.cameraPreview?.nativeElement.offsetHeight;
    this.parentWidth = this.cameraPreview?.nativeElement.offsetWidth;
  }

  ngAfterViewInit() {
    this.updateParentSize();
    // this.initOpencv();
  }

  ngOnDestroy() {
    this.playing = false;
    CameraPreview.stop();
  }

  height: number = 0;
  width: number = 0;
  currentFps: number = 0;
  private _coordinatesPercent: any = null;
  private frame: any = null;
  loading: boolean = false;

  searchingPlastron: boolean = false;

  capture() {
    console.log('### capture ###');
    console.log('this.frame', this.frame);
    const scope = this;
    this.playing = false;
    this.flash = true;
    setTimeout(() => {
      scope.router.navigate(['camera/result']);
      this.flash = false;
    }, 500);
  }

  getPath() {
    let result = '';
    if (!this._coordinatesPercent) {
      return;
    }
    for (const coordinate of this._coordinatesPercent) {
      result += `${coordinate.x * 100},${coordinate.y * 100} `;
    }
    return `M ${result.slice(0, -1)} Z`;
  }

  constructor(
    private ngxOpenCv: NgxOpenCVService,
    @Inject(DOCUMENT) document: Document,
    private router: Router,
    private plastronService: PlastronService,
    private filesService: FilesService,
    private webcamService: WebcamService
  ) {
    console.log('constructor');
    this.filesService.clearTarget();
    this.filesService.clearSession();
    CameraPreview.start({
      parent: 'cameraPreview',
      position: 'rear',
      disableAudio: true,
      toBack: true,
    }).then((r) => this.initOpencv());
  }

  initOpencv() {
    // subscribe to status of OpenCV module
    this.ngxOpenCv.cvState.subscribe((cvState: OpenCVState) => {
      if (cvState.error) {
        // handle errors
        console.log('error');
      } else if (cvState.loading) {
        // e.g. show loading indicator
        console.log('loading');
      } else if (cvState.ready) {
        // do image processing stuff
        console.log('ready');
        this.playing = true;
        this.startWebcam();
      }
    });
  }

  _base64ToImageData(buffer: string, width: number, height: number) {
    return new Promise((resolve) => {
      var image = new Image();
      image.addEventListener('load', function (e: Event) {
        var canvasElement = document.createElement('canvas');
        canvasElement.width = width;
        canvasElement.height = height;
        var context = canvasElement.getContext('2d');
        // @ts-ignore
        context.drawImage(
          e.target as HTMLImageElement,
          0,
          0,
          image.naturalWidth,
          image.naturalHeight
        );

        // @ts-ignore
        resolve(
          context?.getImageData(0, 0, image.naturalWidth, image.naturalHeight)
        );
      });
      image.src = 'data:image/png;base64,' + buffer;
      image.style.display = 'none';
      document.body.appendChild(image);
      setTimeout(() => {
        document.body.removeChild(image);
      }, 1);
    });
  }

  startWebcam() {
    console.log('startWebcam');
    const cv = this.plastronService.cv;
    let frame: any = null;
    if (this.plastronService.getFrame()) {
      frame = this.plastronService.getFrame();
    } else {
      frame = new cv.Mat(this.height, this.width, cv.CV_8UC4);
    }
    const fps = 24;
    const scope = this;

    let currentFps = 0;
    let currentTimestamp = new Date().getTime();

    function processVideo() {
      if (new Date().getTime() - currentTimestamp > 1000) {
        scope.currentFps = currentFps;
        currentFps = 0;
        currentTimestamp = new Date().getTime();
      } else {
        currentFps += 1;
      }

      if (!scope.playing) {
        return;
      }
      try {
        CameraPreview.captureSample({
          quality: 100,
        }).then((result: { value: string }) => {
          console.log('result', result);

          scope._base64ToImageData(result.value, 2000, 2000).then((data) => {
            frame = cv.matFromImageData(data);
            // cv.flip(frame, frame, 1);

            scope.width = frame.cols;
            scope.height = frame.rows;
            console.log('frame', scope.width);

            // cv.imshow('canvas', frame);
            if (!scope.searchingPlastron) {
              scope.searchingPlastron = true;
              try {
                scope.coordinatesPercent =
                  scope.plastronService.getSheetCoordinates(frame);
              } catch (err) {
                console.log(err);
              } finally {
                scope.searchingPlastron = false;
              }

              if (!scope.coordinatesPercent) {
                scope.frame = null;
              } else {
                scope.frame = frame;
                scope.plastronService.setFrame(frame);
              }
            }
          });
        });
      } catch (err) {
        console.log(err);
      }

      setTimeout(processVideo, 1000 / fps);
    }

    // schedule the first one.
    setTimeout(processVideo, 0);
  }
}
