import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
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
  _video: ElementRef | undefined;

  get video(): ElementRef | undefined {
    return this._video;
  }

  @ViewChild('video', { static: true }) set video(el: ElementRef | undefined) {
    console.log('video', el);
    if (el) {
      this._video = el;
      const scope = this;
      console.log('video', el);
      this.webcamService.start(
        {
          width: 4096,
          height: 2160,
        },
        (stream: MediaStream) => {
          scope.stream = stream;
          scope.initOpencv();
          console.log('stream', stream);
        },
        el.nativeElement
      );
      // navigator.mediaDevices
      //   .getUserMedia({
      //     video: {
      //       width: { ideal: 4096 },
      //       height: { ideal: 2160 },
      //       facingMode: 'environment',
      //     },
      //
      //     audio: false,
      //   })
      //   .then(function (stream: MediaStream) {
      //     let video = el.nativeElement;
      //     console.log('video', stream);
      //     if (video) {
      //       // @ts-ignore
      //       video.srcObject = stream;
      //       // @ts-ignore
      //       const play = video.play();
      //       play
      //         .then((test: any) => {
      //           scope.initOpencv();
      //         })
      //         .catch((err: any) => {
      //           console.log(err);
      //         });
      //     }
      //   })
      //   .catch(function (err) {
      //     console.log('An error occurred! ' + err);
      //   });
    }
  }

  @ViewChild('svg') svg: ElementRef | undefined;
  @ViewChild('path') path: ElementRef | undefined;
  @ViewChild('cameraPreview') cameraPreview: ElementRef | undefined;
  private playing: boolean = true;
  parentHeight: number = 0;
  parentWidth: number = 0;
  private camera: any = null;

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
  }

  ngOnDestroy() {
    this.playing = false;
  }

  height: number = 0;
  width: number = 0;
  currentFps: number = 0;
  coordinates: any = null;
  private _coordinatesPercent: any = null;
  private frame: any = null;
  loading: boolean = false;

  searchingPlastron: boolean = false;

  capture() {
    const scope = this;
    this.playing = false;
    this.plastronService.setFrame(this.frame);
    this.flash = true;
    setTimeout(() => {
      scope.router.navigate(['camera/result']);
      this.flash = false;
    }, 500);
  }

  coordinatesToPercent(coordinates: any) {
    if (!coordinates) {
      return;
    }
    this.coordinatesPercent = coordinates.map((coordinate: any) => {
      return {
        x: (coordinate.x / this.width) * 100,
        y: (coordinate.y / this.height) * 100,
      };
    });
  }

  getPath() {
    let result = '';
    if (!this._coordinatesPercent) {
      return;
    }
    for (const coordinate of this._coordinatesPercent) {
      result += `${coordinate.x},${coordinate.y} `;
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

  startWebcam() {
    console.log('startWebcam');
    const cv = this.plastronService.cv;

    let video = this.video?.nativeElement;
    this.camera = new cv.VideoCapture(video);
    this.height = video.videoHeight;
    video.height = this.height;
    this.width = video.videoWidth;
    video.width = this.width;

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
      if (scope.height > 0 && scope.width > 0) {
        try {
          scope.camera.read(frame);
          cv.imshow('canvas', frame);
          if (!scope.searchingPlastron) {
            scope.searchingPlastron = true;
            new Promise(() => {
              try {
                scope.coordinates =
                  scope.plastronService.getPlastronCoordinates(frame);
              } catch (err) {
                console.log(err);
              } finally {
                scope.searchingPlastron = false;
              }

              if (!scope.coordinates) {
                scope.frame = null;
              } else {
                scope.frame = frame;
              }
              scope.coordinatesToPercent(scope.coordinates);
            });
          }
        } catch (err) {}
      } else {
        video = document.getElementById('video');
        scope.camera = new cv.VideoCapture(video);
        scope.height = video.videoHeight;
        video.height = scope.height;
        scope.width = video.videoWidth;
        video.width = scope.width;
        frame.delete();
        frame = new cv.Mat(scope.height, scope.width, cv.CV_8UC4);
      }

      setTimeout(processVideo, 1000 / fps);
    }

    // schedule the first one.
    setTimeout(processVideo, 0);
  }
}
