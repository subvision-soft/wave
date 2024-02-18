import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebcamService {
  private _video: HTMLVideoElement | undefined;

  constructor() {}

  start(
    resolution: { width: any; height: any },
    callback: (arg0: MediaStream) => void,
    video: HTMLVideoElement
  ) {
    this._video = video;
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: resolution.width },
          height: { ideal: resolution.height },
          facingMode: 'environment',
        },
        audio: false,
      })
      .then((stream: MediaStream) => {
        if (this._video) {
          this._video.srcObject = stream;
          this._video.play();
          video?.addEventListener('canplay', () => {
            callback(stream);
          });
          console.log('video', this._video);
        }
        console.log('stream', stream);
      })
      .catch((err) => {
        console.log('An error occurred! ' + err);
      });
  }
}
