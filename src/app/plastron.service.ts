import { Injectable } from '@angular/core';

class PointCv {
  constructor(public x: number, public y: number) {}
}

@Injectable({
  providedIn: 'root',
})
export class PlastronService {
  private cv: any;

  private frame: any = null;

  constructor() {}

  private getDistance(p1: PointCv, p2: PointCv) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  private orderPoints(pts: PointCv[]) {
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

  setCv(cv: any) {
    this.cv = cv;
  }

  getPlastronCoordinates(mat: any) {
    // @ts-ignore
    let img = mat.clone();
    let kernel = new this.cv.Mat.ones(5, 5, this.cv.CV_8UC1);
    this.cv.morphologyEx(
      img,
      img,
      this.cv.MORPH_CLOSE,
      kernel,
      new this.cv.Point(-1, -1),
      3
    );

    let gray = new this.cv.Mat();
    this.cv.cvtColor(img, gray, this.cv.COLOR_BGR2GRAY);
    img.delete();
    let edged = new this.cv.Mat();
    this.cv.Canny(gray, edged, 100, 200);
    gray.delete();
    this.cv.dilate(edged, edged, kernel, new this.cv.Point(-1, -1), 4);
    this.cv.erode(edged, edged, kernel, new this.cv.Point(-1, -1), 4);
    kernel.delete();
    let contours = new this.cv.MatVector();
    let hierarchy = new this.cv.Mat();
    this.cv.findContours(
      edged,
      contours,
      hierarchy,
      this.cv.RETR_EXTERNAL,
      this.cv.CHAIN_APPROX_SIMPLE
    );
    hierarchy.delete();
    edged.delete();

    let contoursArray = [];
    for (let i = 0; i < contours.size(); i++) {
      contoursArray.push(contours.get(i));
    }

    contoursArray.sort(
      (contour1, contour2) =>
        this.cv.contourArea(contour2) - this.cv.contourArea(contour1)
    );

    let screenCnt = null;
    for (let contour of contoursArray) {
      let approxDistance = this.cv.arcLength(contour, true) * 0.02;
      let approx = new this.cv.Mat();
      this.cv.approxPolyDP(contour, approx, approxDistance, true);
      let valid = true;
      if (approx.total() === 4) {
        // let angles = [];
        // for (let i = 0; i < 4; i++) {
        //   let p1 = {
        //     x: approx.data32F[i * 2],
        //     y: approx.data32F[i * 2 + 1],
        //   };
        //   let p2 = {
        //     x: approx.data32F[((i + 1) % 4) * 2],
        //     y: approx.data32F[((i + 1) % 4) * 2 + 1],
        //   };
        //   let p3 = {
        //     x: approx.data32F[((i + 2) % 4) * 2],
        //     y: approx.data32F[((i + 2) % 4) * 2 + 1],
        //   };
        //   let dx1 = p1.x - p2.x;
        //   let dy1 = p1.y - p2.y;
        //   let dx2 = p3.x - p2.x;
        //   let dy2 = p3.y - p2.y;
        //   let angle = Math.abs(
        //     (Math.atan2(dx1 * dy2 - dy1 * dx2, dx1 * dx2 + dy1 * dy2) * 180) /
        //       Math.PI
        //   );
        //   angles.push(angle);
        // }
        //
        // for (let angle of angles) {
        //   if (angle < 70 || angle > 110) {
        //     valid = false;
        //     break;
        //   }
        // }

        let area = this.cv.contourArea(approx);
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
      return null;
    }
    // for (let i = 0; i < screenCnt.total(); i++) {
    //   let p1 = new this.cv.Point(
    //     screenCnt.data32S[i * 2],
    //     screenCnt.data32S[i * 2 + 1]
    //   );
    //   let p2 = new this.cv.Point(
    //     screenCnt.data32S[((i + 1) % screenCnt.total()) * 2],
    //     screenCnt.data32S[((i + 1) % screenCnt.total()) * 2 + 1]
    //   );
    //   this.cv.line(mat, p1, p2, [0, 255, 0, 255], 2);
    // }

    // cv.drawContours(mat, polyLines, -1, [0, 0, 255, 255], 3);
    let topLeft = { x: screenCnt.data32S[0], y: screenCnt.data32S[1] };
    let topLeftIndex = 0;
    let minDistance = this.getDistance(topLeft, new this.cv.Point(0, 0));

    for (let i = 1; i < screenCnt.total(); i++) {
      let distance = this.getDistance(
        { x: screenCnt.data32S[i * 2], y: screenCnt.data32S[i * 2 + 1] },
        new this.cv.Point(0, 0)
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

    return firstHalf.concat(secondHalf);
  }

  getPlastronMat(mat: any) {
    const coordinates = this.getPlastronCoordinates(mat);
    if (coordinates === null) {
      return mat;
    }
    const sourceCoordinates = [
      [coordinates[0].x, coordinates[0].y],
      [coordinates[1].x, coordinates[1].y],
      [coordinates[2].x, coordinates[2].y],
      [coordinates[3].x, coordinates[3].y],
    ];

    let approx = this.cv.matFromArray(
      4,
      1,
      this.cv.CV_32FC2,
      sourceCoordinates.flat()
    );

    const destCoordinates = [
      [0, 0],
      [mat.cols - 1, 0],
      [mat.cols - 1, mat.rows - 1],
      [0, mat.rows - 1],
    ];

    const matFromArray = this.cv.matFromArray(
      4,
      1,
      this.cv.CV_32FC2,
      destCoordinates.flat()
    );
    let transform = this.cv.getPerspectiveTransform(approx, matFromArray);
    let warped = new this.cv.Mat();
    this.cv.warpPerspective(mat, warped, transform, mat.size());
    this.cv.resize(warped, warped, new this.cv.Size(1500, 1500));
    this.cv.flip(warped, warped, 1);
    return warped;
  }

  setFrame(frame: any) {
    console.log('setFrame', frame);
    this.frame = frame;
  }
  getFrame() {
    console.log('getFrame', this.frame);
    return this.frame;
  }
}
