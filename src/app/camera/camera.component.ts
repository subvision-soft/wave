import { Component, Inject, isDevMode, ViewChild } from '@angular/core';
import { NgxOpenCVService } from '../../lib/ngx-open-cv.service';
import { OpenCVState } from '../../lib/models';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent {
  private cvState: string = '';
  stream: MediaStream | undefined;
  @ViewChild('video', { static: true }) video: any;
  private playing: boolean = true;

  height: number = 0;
  width: number = 0;

  getFrameFromStream() {}

  constructor(
    private ngxOpenCv: NgxOpenCVService,
    @Inject(DOCUMENT) document: Document,
    private router: Router
  ) {
    router.events.subscribe((val) => {
      this.playing = false;
    });

    const scope = this;
    navigator.mediaDevices
      .getUserMedia({
        video: isDevMode() ? true : { facingMode: { exact: 'environment' } },
        audio: false,
      })
      .then(function (stream: MediaStream) {
        let video = document.getElementById('video');
        // @ts-ignore
        video.srcObject = stream;
        // @ts-ignore
        video.play().then((test) => {
          console.log('test');
          scope.initOpencv();
        });
      })
      .catch(function (err) {
        console.log('An error occurred! ' + err);
      });
  }

  initOpencv() {
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
        this.playing = true;
        this.startWebcam();
      }
    });
  }

  // @ts-ignore
  getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  // @ts-ignore
  orderPoints(pts) {
    let rect = new Array(4);
    let pts2 = [...pts];

    pts2.sort((a, b) => a.x + a.y - (b.x + b.y));
    rect[0] = pts2[0];
    rect[2] = pts2[pts2.length - 1];

    pts2.sort((a, b) => a.x - a.y - (b.x - b.y));
    rect[3] = pts2[0];
    rect[1] = pts2[pts2.length - 1];

    return rect;
  }

  // @ts-ignore
  extractDocument(mat) {
    // @ts-ignore
    const cv = window['cv'];
    let img = mat.clone();
    let kernel = new cv.Mat.ones(5, 5, cv.CV_8UC1);
    cv.morphologyEx(img, img, cv.MORPH_CLOSE, kernel, new cv.Point(-1, -1), 3);

    let gray = new cv.Mat();
    cv.cvtColor(img, gray, cv.COLOR_BGR2GRAY);
    img.delete();
    let blurred = new cv.Mat();
    cv.GaussianBlur(gray, blurred, new cv.Size(131, 131), 50);
    blurred.delete();
    let edged = new cv.Mat();
    cv.Canny(gray, edged, 100, 200);
    gray.delete();

    cv.dilate(edged, edged, kernel, new cv.Point(-1, -1), 4);
    cv.erode(edged, edged, kernel, new cv.Point(-1, -1), 4);
    kernel.delete();
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(
      edged,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );
    hierarchy.delete();
    edged.delete();

    let contoursArray = [];
    for (let i = 0; i < contours.size(); i++) {
      contoursArray.push(contours.get(i));
    }

    contoursArray.sort(
      (contour1, contour2) =>
        cv.contourArea(contour2) - cv.contourArea(contour1)
    );

    let screenCnt = null;
    for (let contour of contoursArray) {
      let approxDistance = cv.arcLength(contour, true) * 0.02;
      let approx = new cv.Mat();
      cv.approxPolyDP(contour, approx, approxDistance, true);

      let valid = true;

      if (approx.total() === 4) {
        let angles = [];
        for (let i = 0; i < 4; i++) {
          let p1 = {
            x: approx.data32F[i * 2],
            y: approx.data32F[i * 2 + 1],
          };
          let p2 = {
            x: approx.data32F[((i + 1) % 4) * 2],
            y: approx.data32F[((i + 1) % 4) * 2 + 1],
          };
          let p3 = {
            x: approx.data32F[((i + 2) % 4) * 2],
            y: approx.data32F[((i + 2) % 4) * 2 + 1],
          };
          let dx1 = p1.x - p2.x;
          let dy1 = p1.y - p2.y;
          let dx2 = p3.x - p2.x;
          let dy2 = p3.y - p2.y;
          let angle = Math.abs(
            (Math.atan2(dx1 * dy2 - dy1 * dx2, dx1 * dx2 + dy1 * dy2) * 180) /
              Math.PI
          );
          angles.push(angle);
        }

        for (let angle of angles) {
          if (angle < 70 || angle > 110) {
            valid = false;
            break;
          }
        }

        let area = cv.contourArea(approx);
        let ratio = area / (mat.cols * mat.rows);
        if (ratio < 0.1) {
          valid = false;
        }

        if (valid) {
          screenCnt = approx;
          break;
        }
      }
    }

    if (screenCnt === null) {
      throw new Error('Aucun plastron trouvé');
    }
    for (let i = 0; i < screenCnt.total(); i++) {
      let p1 = new cv.Point(
        screenCnt.data32S[i * 2],
        screenCnt.data32S[i * 2 + 1]
      );
      let p2 = new cv.Point(
        screenCnt.data32S[((i + 1) % screenCnt.total()) * 2],
        screenCnt.data32S[((i + 1) % screenCnt.total()) * 2 + 1]
      );
      cv.line(mat, p1, p2, [0, 255, 0, 255], 2);
    }

    // cv.drawContours(mat, polyLines, -1, [0, 0, 255, 255], 3);
    return mat;

    let topLeft = { x: screenCnt.data32S[0], y: screenCnt.data32S[1] };
    let topLeftIndex = 0;
    let minDistance = this.getDistance(topLeft, new cv.Point(0, 0));

    for (let i = 1; i < screenCnt.total(); i++) {
      let distance = this.getDistance(
        { x: screenCnt.data32S[i * 2], y: screenCnt.data32S[i * 2 + 1] },
        new cv.Point(0, 0)
      );
      if (distance < minDistance) {
        minDistance = distance;
        topLeftIndex = i;
      }
    }

    let firstHalf = [];
    for (let i = 0; i < topLeftIndex; i++) {
      firstHalf.push({
        x: screenCnt.data32S[i * 2],
        y: screenCnt.data32S[i * 2 + 1],
      });
    }

    let secondHalf = [];
    for (let i = topLeftIndex; i < screenCnt.total(); i++) {
      secondHalf.push({
        x: screenCnt.data32S[i * 2],
        y: screenCnt.data32S[i * 2 + 1],
      });
    }

    let points = firstHalf.concat(secondHalf);

    let pointsData = new Float32Array(points.length * 2);
    for (let i = 0; i < points.length; i++) {
      pointsData[i * 2] = points[i].x;
      pointsData[i * 2 + 1] = points[i].y;
    }

    const sourceCoordinates = [
      [points[0].x, points[0].y],
      [points[1].x, points[1].y],
      [points[2].x, points[2].y],
      [points[3].x, points[3].y],
    ];

    let approx = cv.matFromArray(4, 1, cv.CV_32FC2, sourceCoordinates.flat());

    const destCoordinates = [
      [0, 0],
      [mat.cols - 1, 0],
      [mat.cols - 1, mat.rows - 1],
      [0, mat.rows - 1],
    ];

    const matFromArray = cv.matFromArray(
      4,
      1,
      cv.CV_32FC2,
      destCoordinates.flat()
    );
    let transform = cv.getPerspectiveTransform(approx, matFromArray);
    let warped = new cv.Mat();
    cv.warpPerspective(mat, warped, transform, mat.size());
    console.log(transform);
    // cv.resize(warped, warped, new cv.Size(1500, 1500));
    return warped;
  }

  startWebcam() {
    // @ts-ignore
    const cv = window['cv'];
    let video = document.getElementById('video');

    while (video == null) {
      video = document.getElementById('video');
      setTimeout(() => {}, 1000);
    }
    // @ts-ignore
    let cap = new cv.VideoCapture(video);
    // @ts-ignore
    this.height = video.videoHeight;
    // @ts-ignore
    video.height = this.height;

    // @ts-ignore
    this.width = video.videoWidth;
    // @ts-ignore
    video.width = this.width;
    // @ts-ignore
    let frame = new cv.Mat(this.height, this.width, cv.CV_8UC4);
    const fps = 60;
    const scope = this;
    function processVideo() {
      // @ts-ignore
      if (!scope.playing) {
        frame.delete();
        return;
      }
      if (scope.height > 0 && scope.width > 0) {
        try {
          // @ts-ignore
          cap.read(frame);
          try {
            cv.imshow('canvas', scope.extractDocument(frame));
          } catch (err) {
            console.log(err);
            cv.imshow('canvas', frame);
          }
          // mat.delete();
        } catch (err) {
          console.log(err);
          //print stack trace
          // @ts-ignore
          console.log(err.stack);
        }
      } else {
        video = document.getElementById('video');
        // @ts-ignore
        cap = new cv.VideoCapture(video);
        // @ts-ignore
        scope.height = video.videoHeight;
        // @ts-ignore
        video.height = scope.height;
        // @ts-ignore
        scope.width = video.videoWidth;
        // @ts-ignore
        video.width = scope.width;
        frame.delete();
        // @ts-ignore
        frame = new cv.Mat(scope.height, scope.width, cv.CV_8UC4);
      }

      setTimeout(processVideo, 1000 / fps);
    }

    // schedule the first one.
    setTimeout(processVideo, 0);
  }
}
