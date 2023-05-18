import { Component, ViewChild } from '@angular/core';
import { NgxOpenCVService } from '../../lib/ngx-open-cv.service';
import { OpenCVState } from '../../lib/models';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent {
  private cvState: string = '';
  stream: MediaStream | undefined;
  @ViewChild('video', { static: true }) video: any;

  getFrameFromStream() {}

  constructor(private ngxOpenCv: NgxOpenCVService) {
    let video = document.getElementById('video'); // video is the id of video tag

    const scope = this;

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: {
            exact: 'environment',
          },
        },
        // video: true,

        audio: false,
      })
      .then(function (stream: MediaStream) {
        scope.stream = stream;
      })
      .catch(function (err) {
        console.log('An error occurred! ' + err);
      });
    // subscribe to status of OpenCV module
    this.ngxOpenCv.cvState.subscribe((cvState: OpenCVState) => {
      // do something with the state string
      this.cvState = cvState.state;
      if (cvState.error) {
        // handle errors
        console.log('error');
      } else if (cvState.loading) {
        // e.g. show loading indicator
        console.log('loading');
      } else if (cvState.ready) {
        // do image processing stuff
        console.log('ready');

        // @ts-ignore
        const cv = window['cv'];
        // let video = document.getElementById('video');
        // // @ts-ignore
        //
        // const cap = new cv.VideoCapture(video);
        // // @ts-ignore
        // const frame = new cv.Mat(video.width, video.height, cv.CV_8UC4);
        // // const fgmask = new cv.Mat(video.height, video.width, cv.CV_8UC1);
        // const fgbg = new cv.BackgroundSubtractorMOG2(500, 16, true);
        // const dilateElement = cv.getStructuringElement(
        //   cv.MORPH_RECT,
        //   new cv.Size(24, 24)
        // );
        // const fps = 30;
        // function processVideo() {
        //   console.log('processVideo');
        //   try {
        //     // read frames from camera
        //     cap.read(frame);
        //     // @ts-ignore
        //     cv.imshow('canvas', frame);
        //     // schedule the next one.
        //     setTimeout(processVideo, 1000 / fps);
        //   } catch (err) {
        //     console.log(err);
        //   }
        // }
        //
        // // schedule the first one.
        // setTimeout(processVideo, 0);
      }
    });
  }
}
