import { Injectable } from '@angular/core';

class PointCv {
  constructor(public x: number = -1, public y: number = -1) {}
}

export enum Zone {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  CENTER = 'center',
  UNDEFINED = 'undefined',
}

class Cible {
  constructor(public impacts: Impact[] = [], public image: any = null) {}
}
class Impact {
  constructor(
    public points: number = 0,
    public zone: Zone = Zone.UNDEFINED,
    public angle: number = -1
  ) {}
}

@Injectable({
  providedIn: 'root',
})
export class PlastronService {
  private cv: any;

  private frame: any = null;

  private detectionSize: number = 300;

  private impactColor = null;

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
    this.cv.resize(
      img,
      img,
      new this.cv.Size(this.detectionSize, this.detectionSize)
    );

    let kernel = new this.cv.Mat.ones(5, 5, this.cv.CV_8UC1);
    this.cv.morphologyEx(
      img,
      img,
      this.cv.MORPH_CLOSE,
      kernel,
      new this.cv.Point(-1, -1),
      3
    );

    const maxValue = 255; // Maximum pixel value for the thresholded image
    const blockSize = 11; // Size of the neighborhood for thresholding
    const C = 2; // Constant subtracted from the mean
    let gray = new this.cv.Mat();
    this.cv.cvtColor(img, gray, this.cv.COLOR_BGR2GRAY);
    this.cv.adaptiveThreshold(
      gray,
      gray,
      maxValue,
      this.cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      this.cv.THRESH_BINARY,
      blockSize,
      C
    );
    kernel.delete();
    kernel = new this.cv.Mat.ones(3, 3, this.cv.CV_8UC1);
    this.cv.bitwise_not(gray, gray);

    this.cv.morphologyEx(
      gray,
      gray,
      this.cv.MORPH_OPEN,
      kernel,
      new this.cv.Point(-1, -1),
      1
    );

    this.cv.dilate(gray, gray, kernel, new this.cv.Point(-1, -1), 3);

    this.cv.morphologyEx(
      gray,
      gray,
      this.cv.MORPH_CLOSE,
      kernel,
      new this.cv.Point(-1, -1),
      2
    );

    let contours = new this.cv.MatVector();
    let hierarchy = new this.cv.Mat();
    this.cv.findContours(
      gray,
      contours,
      hierarchy,
      this.cv.RETR_EXTERNAL,
      this.cv.CHAIN_APPROX_SIMPLE
    );

    this.cv.drawContours(
      gray,
      contours,
      -1,
      [255, 255, 255, 255],
      this.cv.FILLED
    );
    this.cv.morphologyEx(
      gray,
      gray,
      this.cv.MORPH_OPEN,
      kernel,
      new this.cv.Point(-1, -1),
      10
    );
    this.cv.erode(gray, gray, kernel, new this.cv.Point(-1, -1), 3);

    this.cv.findContours(
      gray,
      contours,
      hierarchy,
      this.cv.RETR_EXTERNAL,
      this.cv.CHAIN_APPROX_SIMPLE
    );

    //
    // let edged = new this.cv.Mat();
    // this.cv.Canny(gray, edged, 100, 200);
    //
    // gray.delete();
    // this.cv.dilate(edged, edged, kernel, new this.cv.Point(-1, -1), 4);
    // this.cv.erode(edged, edged, kernel, new this.cv.Point(-1, -1), 4);
    //
    // kernel.delete();
    // let contours = new this.cv.MatVector();
    // let hierarchy = new this.cv.Mat();
    // this.cv.findContours(
    //   edged,
    //   contours,
    //   hierarchy,
    //   this.cv.RETR_EXTERNAL,
    //   this.cv.CHAIN_APPROX_SIMPLE
    // );
    // this.cv.drawContours(
    //   edged,
    //   contours,
    //   -1,
    //   [255, 255, 255, 255],
    //   this.cv.FILLED
    // );
    // this.cv.findContours(
    //   edged,
    //   contours,
    //   hierarchy,
    //   this.cv.RETR_EXTERNAL,
    //   this.cv.CHAIN_APPROX_SIMPLE
    // );
    // hierarchy.delete();
    // edged.delete();

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
      let approxDistance = this.cv.arcLength(contour, true) * 0.1;
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
        let ratio = area / (img.cols * img.rows);
        if (ratio < 0.1) {
          valid = false;
        }

        if (valid) {
          screenCnt = approx;
          break;
        }
        approx.delete();
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

    // this.cv.drawContours(mat, polyLines, -1, [0, 0, 255, 255], 3);
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

    const concat = firstHalf.concat(secondHalf);

    concat.map((coordinate) => {
      coordinate.x = (coordinate.x / this.detectionSize) * mat.cols;
      coordinate.y = (coordinate.y / this.detectionSize) * mat.rows;
    });
    return this.orderPoints(concat);
  }

  getBiggestContour(contours: any) {
    console.log('start getBiggestContour');
    let maxArea = 0;
    let biggestContour = null;
    let contoursArray = [];
    for (let i = 0; i < contours.size(); i++) {
      contoursArray.push(contours.get(i));
    }
    for (let contour of contoursArray) {
      const boundingRect = this.cv.boundingRect(contour);
      const area = boundingRect.width * boundingRect.height;
      if (area > maxArea) {
        maxArea = area;
        biggestContour = contour;
      }
    }
    console.log('end getBiggestContour');
    return biggestContour;
  }

  getPlastronMat(mat: any) {
    console.log('start getPlastronMat');
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
    console.log('end getPlastronMat');
    return warped;
  }

  getPointOnEllipse(
    center: PointCv,
    radiusX: number,
    radiusY: number,
    angle: number
  ) {
    const x = center.x + Math.cos(angle) * radiusX;
    const y = center.y + Math.sin(angle) * radiusY;
    return new this.cv.Point(x, y);
  }

  rotatePoint(center: PointCv, point: PointCv, angle: number) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    // Translate point back to origin:
    const translatedX = point.x - center.x;
    const translatedY = point.y - center.y;

    // Rotate point
    const rotatedX = translatedX * c - translatedY * s;
    const rotatedY = translatedX * s + translatedY * c;

    // Translate point back:
    point.x = rotatedX + center.x;
    point.y = rotatedY + center.y;

    return point;
  }

  getPoint(center: PointCv, border: PointCv, impact: PointCv) {
    const length = this.getDistance(center, border);
    const distance = this.getDistance(center, impact);
    const percent = distance / length;
    const realLength = 25;
    let realDistance = Math.ceil(realLength * percent);
    let point = 570;
    let i = 0;
    if (realDistance > 45) {
      return 0;
    }
    for (; i < 5 && realDistance > 0; i++) {
      point -= 6;
      realDistance -= 1;
    }
    for (; i < 48 && realDistance > 0; i++) {
      point -= 3;
      realDistance -= 1;
    }
    return point;
  }

  getImpactsCenters(mat: any): PointCv[] {
    console.log('start getImpactsCenters');
    const points: PointCv[] = [];
    if (this.impactColor !== null) {
      const impactsMask = this.getColorMask(mat, this.impactColor);
      console.log('getImpactsCenters impactsMask', impactsMask);
      const kernel = this.cv.Mat.ones(3, 3, this.cv.CV_8UC1);
      this.cv.dilate(
        impactsMask,
        impactsMask,
        kernel,
        new this.cv.Point(-1, -1),
        1
      );
      kernel.delete();
      const contours = new this.cv.MatVector();
      const tempMat = new this.cv.Mat();
      this.cv.findContours(
        impactsMask,
        contours,
        tempMat,
        this.cv.RETR_LIST,
        this.cv.CHAIN_APPROX_SIMPLE
      );
      tempMat.delete();
      impactsMask.delete();
      console.log('getImpactsCenters contours', contours);
      let contoursArray = [];
      for (let i = 0; i < contours.size(); i++) {
        contoursArray.push(contours.get(i));
      }
      for (const contour of contoursArray) {
        if (contour.size().height < 5) {
          continue;
        }
        console.log('getImpactsCenters contour', contour);
        const impact = this.cv.fitEllipse(contour);
        points.push(impact.center);
      }
    }
    console.log('end getImpactsCenters');
    return points;
  }

  autoBrightnessAndContrast(mat: any, clipHistPercent: number) {
    let gray = new this.cv.Mat();
    this.cv.cvtColor(mat, gray, this.cv.COLOR_BGR2GRAY);

    let hist = new this.cv.Mat();
    let histSize = new this.cv.Mat(256, 1, this.cv.CV_32SC1);
    let histRange = new this.cv.Mat(1, 2, this.cv.CV_32FC1);
    histRange.data32F.set([0, 256]);
    console.log('start calcHist');

    const matVector = new this.cv.MatVector();
    matVector.push_back(gray);
    this.cv.calcHist(
      matVector,
      [0],
      new this.cv.Mat(),
      hist,
      histSize,
      histRange
    );
    console.log('end calcHist');

    let histSizeTotal = hist.total();
    let accumulator = new this.cv.Mat();
    this.cv.reduce(hist, accumulator, 0, this.cv.REDUCE_SUM, -1);

    let maximum = accumulator.data32F[histSizeTotal - 1];
    clipHistPercent *= maximum / 100.0;
    clipHistPercent /= 2.0;

    let minimumGray = 0;
    while (accumulator.data32F[minimumGray] < clipHistPercent) {
      minimumGray++;
    }

    let maximumGray = histSizeTotal - 1;
    while (accumulator.data32F[maximumGray] >= maximum - clipHistPercent) {
      maximumGray--;
    }

    let range = maximumGray - minimumGray;
    if (range === 0) {
      return mat;
    }

    let alpha = 255 / range;
    let beta = -minimumGray * alpha;

    let autoResult = new this.cv.Mat();
    mat.convertTo(autoResult, -1, alpha, beta);

    // Libérer la mémoire des objets Mat
    gray.delete();
    hist.delete();
    histSize.delete();
    histRange.delete();
    accumulator.delete();

    return autoResult;
  }

  getOuterCircle(mat: any) {
    console.log('start getOuterCircle');
    let show = false;

    // mat = this.autoBrightnessAndContrast(mat, 2);

    let circle = new this.cv.Mat(
      mat.cols,
      mat.rows,
      this.cv.CV_8UC1,
      new this.cv.Scalar(0, 0, 0)
    );
    this.cv.circle(
      circle,
      new this.cv.Point(mat.cols / 2, mat.rows / 2),
      mat.cols / 2.2,
      new this.cv.Scalar(255, 255, 255),
      -1
    );

    let kernelSize = 5; // Size of the kernel matrix
    let kernelData = Array(kernelSize).fill(Array(kernelSize).fill(1)); // Create a 2D array filled with ones

    // Convert the kernel data to a cv.Mat object
    let kernel = this.cv.matFromArray(
      kernelSize,
      kernelSize,
      this.cv.CV_32F,
      kernelData.flat()
    );

    let removeHoles = mat.clone();
    if (this.impactColor != null) {
      let redDots = this.getColorMask(mat, this.impactColor);
      this.cv.dilate(redDots, redDots, kernel, new this.cv.Point(-1, -1), 1);
      this.cv.bitwise_not(redDots, redDots);
      let mask3 = new this.cv.Mat(
        mat.size().width,
        mat.size().height,
        this.cv.CV_8UC3,
        [0, 0, 0, 255]
      );
      console.log('wesh');

      this.cv.cvtColor(redDots, mask3, this.cv.COLOR_GRAY2BGR);
      console.log('wesh');

      // this.cv.bitwise_and(mat, mask3, removeHoles);
      mask3.delete();
    }

    let hsv = new this.cv.Mat();
    this.cv.cvtColor(removeHoles, hsv, this.cv.COLOR_BGR2HSV);

    let hsvChannels = new this.cv.MatVector();
    this.cv.split(hsv, hsvChannels);
    let value = hsvChannels.get(2);

    let value_mask = new this.cv.Mat();
    let minMaxLocResult = this.cv.minMaxLoc(value);
    let max =
      (minMaxLocResult.maxVal - minMaxLocResult.minVal) / 2 +
      minMaxLocResult.minVal;

    const min = new this.cv.Scalar(minMaxLocResult.minVal);
    const high = new this.cv.Scalar(max);

    let minMat = new this.cv.Mat(value.rows, value.cols, value.type(), min);
    let highMat = new this.cv.Mat(value.rows, value.cols, value.type(), high);
    this.cv.inRange(value, minMat, highMat, value_mask);
    minMat.delete();
    highMat.delete();
    this.cv.bitwise_and(value_mask, circle, value_mask);

    let close = new this.cv.Mat();
    this.cv.morphologyEx(value_mask, close, this.cv.MORPH_CLOSE, kernel);
    value_mask.delete();
    this.cv.morphologyEx(
      close,
      close,
      this.cv.MORPH_OPEN,
      kernel,
      new this.cv.Point(-1, -1),
      1
    );

    let open = new this.cv.Mat();
    let kernelSize2 = 30; // Size of the kernel matrix
    let kernelData2 = Array(kernelSize2).fill(Array(kernelSize2).fill(1)); // Create a 2D array filled with ones
    let kernel2 = this.cv.matFromArray(
      kernelSize2,
      kernelSize2,
      this.cv.CV_32F,
      kernelData2.flat()
    );
    let contours = new this.cv.MatVector();
    this.cv.findContours(
      close,
      contours,
      new this.cv.Mat(),
      this.cv.RETR_EXTERNAL,
      this.cv.CHAIN_APPROX_SIMPLE
    );
    let biggestContour = this.getBiggestContour(contours);
    if (biggestContour == null) {
      throw new Error('Problème lors de la détection des visuels');
    }
    const biggestContourVector = new this.cv.MatVector();
    biggestContourVector.push_back(biggestContour);

    this.cv.drawContours(
      close,
      biggestContourVector,
      -1,
      new this.cv.Scalar(255, 255, 255),
      -1
    );
    biggestContourVector.delete();
    this.cv.morphologyEx(close, open, this.cv.MORPH_OPEN, kernel2);
    let newContours = new this.cv.MatVector();
    this.cv.findContours(
      open,
      newContours,
      new this.cv.Mat(),
      this.cv.RETR_EXTERNAL,
      this.cv.CHAIN_APPROX_SIMPLE
    );

    biggestContour = this.getBiggestContour(newContours);
    if (biggestContour == null || biggestContour.size().height < 5) {
      throw new Error('Problème lors de la détection des visuels');
    }
    let ellipse = this.cv.fitEllipse(new this.cv.Mat(biggestContour));
    // Nettoyage des contours
    for (let i = 0; i < 4; i++) {
      let empty = new this.cv.Mat.zeros(mat.size(), mat.type());
      let center = new this.cv.Point(ellipse.center.x, ellipse.center.y);
      let axes = new this.cv.Size(
        ellipse.size.width / 2,
        ellipse.size.height / 2
      );
      let angle = ellipse.angle;
      let startAngle = 0;
      let endAngle = 360;
      let color = new this.cv.Scalar(255, 255, 255);
      let thickness = this.cv.FILLED;
      let lineType = this.cv.LINE_8;

      this.cv.ellipse(
        empty,
        center,
        axes,
        angle,
        startAngle,
        endAngle,
        color,
        thickness,
        lineType
      );
      this.cv.circle(mat, ellipse.center, 2, [255, 0, 0, 255], -1);
      this.cv.cvtColor(empty, empty, this.cv.COLOR_BGR2GRAY);
      let xor = new this.cv.Mat();
      this.cv.bitwise_xor(empty, open, xor);
      this.cv.morphologyEx(xor, xor, this.cv.MORPH_OPEN, kernel);
      this.cv.bitwise_not(xor, xor);
      this.cv.bitwise_and(open, xor, xor);

      let xorContours = new this.cv.MatVector();
      this.cv.findContours(
        xor,
        xorContours,
        new this.cv.Mat(),
        this.cv.RETR_EXTERNAL,
        this.cv.CHAIN_APPROX_SIMPLE
      );

      biggestContour = this.getBiggestContour(xorContours);
      if (biggestContour == null || biggestContour.size().height < 5) {
        throw new Error('Problème lors de la détection des visuels');
      }
      ellipse = this.cv.fitEllipse(new this.cv.Mat(biggestContour));
      if (
        ellipse.size.width < ellipse.size.height * 0.7 ||
        ellipse.size.width > ellipse.size.height * 1.3
      ) {
        throw new Error('Problème lors de la détection des visuels');
      }
    }
    let center = new this.cv.Point(ellipse.center.x, ellipse.center.y);
    let axes = new this.cv.Size(
      ellipse.size.width / 2,
      ellipse.size.height / 2
    );
    let angle = ellipse.angle;
    let startAngle = 0;
    let endAngle = 360;
    let color = new this.cv.Scalar(0, 255, 0, 255);
    let thickness = 3;

    this.cv.ellipse(
      mat,
      center,
      axes,
      angle,
      startAngle,
      endAngle,
      color,
      thickness
    );
    // this.cv.imshow('debug', mat);
    return ellipse;
  }

  getAverageColor(mat: any) {
    console.log('start getAverageColor');
    let hsv = new this.cv.Mat();
    this.cv.cvtColor(mat, hsv, this.cv.COLOR_BGR2HSV);

    let hsvChannels = new this.cv.MatVector();
    this.cv.split(hsv, hsvChannels);
    let saturation = hsvChannels.get(1);

    let minMaxLocResult = this.cv.minMaxLoc(saturation);
    let min =
      (minMaxLocResult.maxVal - minMaxLocResult.minVal) / 1.05 +
      minMaxLocResult.minVal;

    const lowerBound = new this.cv.Scalar(min);
    const upperBound = new this.cv.Scalar(minMaxLocResult.maxVal);

    let low = new this.cv.Mat(
      saturation.rows,
      saturation.cols,
      saturation.type(),
      lowerBound
    );
    let high = new this.cv.Mat(
      saturation.rows,
      saturation.cols,
      saturation.type(),
      upperBound
    );

    this.cv.inRange(saturation, low, high, saturation);

    console.log('inRange done');
    let contours = new this.cv.MatVector();
    let hierarchy = new this.cv.Mat();
    this.cv.findContours(
      saturation,
      contours,
      hierarchy,
      this.cv.RETR_EXTERNAL,
      this.cv.CHAIN_APPROX_SIMPLE
    );

    let biggestContour = this.getBiggestContour(contours);
    if (biggestContour == null) {
      return null;
    }
    console.log('biggestContour done', biggestContour);

    let rect = this.cv.boundingRect(biggestContour);
    let biggestEdge = Math.max(rect.width, rect.height);
    let kernel = this.cv.Mat.ones(
      biggestEdge / 4,
      biggestEdge / 4,
      this.cv.CV_8U
    );
    this.cv.erode(saturation, saturation, kernel, new this.cv.Point(-1, -1), 1);

    let cropped = mat.roi(rect);
    const color = this.cv.mean(cropped);

    // Libérer la mémoire des objets Mat
    hsv.delete();
    hsvChannels.delete();
    saturation.delete();
    contours.delete();
    hierarchy.delete();
    biggestContour.delete();
    kernel.delete();
    cropped.delete();

    console.log(color);
    return color;
  }
  getColorMask(mat: any, color: any) {
    console.log('start getColorMask');
    const colorMat = new this.cv.Mat(1, 1, this.cv.CV_8UC3, color);
    const hsv = new this.cv.Mat();
    this.cv.cvtColor(colorMat, hsv, this.cv.COLOR_BGR2HSV);
    colorMat.delete();

    const min = new this.cv.Scalar(hsv.ucharPtr(0, 0)[0] - 10, 100, 50);
    const max = new this.cv.Scalar(hsv.ucharPtr(0, 0)[0] + 10, 255, 255);
    hsv.delete();
    const mask = new this.cv.Mat();
    const hsvMat = new this.cv.Mat();
    this.cv.cvtColor(mat, hsvMat, this.cv.COLOR_BGR2HSV);
    const hsvChannels = new this.cv.MatVector();
    this.cv.split(hsvMat, hsvChannels);

    let minMat = new this.cv.Mat(hsvMat.rows, hsvMat.cols, hsvMat.type(), min);
    let highMat = new this.cv.Mat(hsvMat.rows, hsvMat.cols, hsvMat.type(), max);

    this.cv.inRange(hsvMat, minMat, highMat, mask);
    hsvMat.delete();
    const kernel = this.cv.Mat.ones(5, 5, this.cv.CV_8UC1);
    this.cv.morphologyEx(
      mask,
      mask,
      this.cv.MORPH_OPEN,
      kernel,
      new this.cv.Point(-1, -1),
      3
    );
    kernel.delete();
    console.log('end getColorMask');
    return mask;
  }

  getTopLeftTarget(mat: any) {
    console.log('start getTopLeftTarget');
    const img = mat.clone();
    const rectCrop = new this.cv.Rect(0, 0, img.cols / 2, img.rows / 2);
    const croppedImage = img.roi(rectCrop);
    img.delete();
    return croppedImage;
  }

  getTopRightTarget(mat: any) {
    const img = mat.clone();
    const rectCrop = new this.cv.Rect(
      img.cols / 2,
      0,
      img.cols / 2,
      img.rows / 2
    );
    const croppedImage = img.roi(rectCrop);
    img.delete();
    return croppedImage;
  }

  getBottomLeftTarget(mat: any) {
    console.log('start getBottomLeftTarget');
    const img = mat.clone();
    const rectCrop = new this.cv.Rect(
      0,
      img.rows / 2,
      img.cols / 2,
      img.rows / 2
    );
    const croppedImage = img.roi(rectCrop);
    img.delete();
    console.log('end getBottomLeftTarget');

    return croppedImage;
  }
  getAngle(p1: PointCv, p2: PointCv) {
    console.log('start getAngle');
    console.log('end getAngle');
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  }
  toRadians = (degrees: number) => {
    console.log('start toRadians');
    console.log('end toRadians');
    return (degrees * Math.PI) / 180;
  };
  toDegrees = (radians: number) => {
    console.log('start toDegrees');
    console.log('end toDegrees');
    return radians * (180 / Math.PI);
  };

  process() {
    console.log('start process');
    let mat = this.getPlastronMat(this.frame);
    this.impactColor = this.getAverageColor(mat);
    let hashMapVisuels = this.getHashMapVisuels(mat);
    let impactPoints = this.getImpactsCenters(mat);
    let result = new Cible();
    for (let zone in hashMapVisuels) {
      let ellipse = hashMapVisuels[zone];
      let center = new this.cv.Point(ellipse.center.x, ellipse.center.y);
      let axes = new this.cv.Size(
        { ...ellipse.size }.width / 2,
        { ...ellipse.size }.height / 2
      );
      let angle = ellipse.angle;
      let startAngle = 0;
      let endAngle = 360;
      let color = new this.cv.Scalar(0, 0, 255, 255);
      let thickness = 1;
      let lineType = this.cv.LINE_8;

      this.cv.ellipse(
        mat,
        center,
        axes,
        angle,
        startAngle,
        endAngle,
        [255, 0, 0, 255],
        thickness,
        lineType
      );
      let size = { ...ellipse.size };
      size.width *= 0.2;
      size.height *= 0.2;
      axes = new this.cv.Size(size.width / 2, size.height / 2);

      this.cv.ellipse(
        mat,
        center,
        axes,
        angle,
        startAngle,
        endAngle,
        color,
        thickness,
        lineType
      );
      size = { ...ellipse.size };
      size.width *= 0.6;
      size.height *= 0.6;
      axes = new this.cv.Size(size.width / 2, size.height / 2);

      this.cv.ellipse(
        mat,
        center,
        axes,
        angle,
        startAngle,
        endAngle,
        color,
        thickness,
        lineType
      );
      size = { ...ellipse.size };
      size.width *= 1.4;
      size.height *= 1.4;
      axes = new this.cv.Size(size.width / 2, size.height / 2);

      this.cv.ellipse(
        mat,
        center,
        axes,
        angle,
        startAngle,
        endAngle,
        color,
        thickness,
        lineType
      );
      size = { ...ellipse.size };
      size.width *= 1.8;
      size.height *= 1.8;
      axes = new this.cv.Size(size.width / 2, size.height / 2);

      this.cv.ellipse(
        mat,
        center,
        axes,
        angle,
        startAngle,
        endAngle,
        color,
        thickness,
        lineType
      );
    }

    console.log('Impact points :' + impactPoints.length);
    for (let point of impactPoints) {
      this.cv.circle(mat, point, 1, [0, 255, 0, 255], -1);
      let minDistance = Number.MAX_VALUE;
      let closestZone = null;
      console.log('hashMapVisuels :' + hashMapVisuels);
      for (let zone in hashMapVisuels) {
        let distance = this.getDistance(point, hashMapVisuels[zone].center);
        if (minDistance > distance) {
          minDistance = distance;
          closestZone = zone;
        }
      }
      if (closestZone == null) {
        throw new Error('Aucune zone trouvée');
      }

      let radAngle = this.getAngle(point, hashMapVisuels[closestZone].center);
      let angle = radAngle + this.toRadians(360);
      let ellipseAngle = this.toRadians(
        hashMapVisuels[closestZone].angle + 360
      );
      angle = angle - ellipseAngle;
      let pointOnEllipse = this.getPointOnEllipse(
        hashMapVisuels[closestZone].center,
        hashMapVisuels[closestZone].size.width / 2,
        hashMapVisuels[closestZone].size.height / 2,
        angle
      );
      pointOnEllipse = this.rotatePoint(
        hashMapVisuels[closestZone].center,
        pointOnEllipse,
        ellipseAngle + this.toRadians(180)
      );

      console.log('pointOnEllipse :', pointOnEllipse);
      console.log('ellipse :', hashMapVisuels[closestZone]);
      console.log('mat :', mat);
      this.cv.circle(mat, pointOnEllipse, 2, [255, 0, 0, 255], -1);
      this.cv.putText(
        mat,
        String(
          this.getPoint(
            hashMapVisuels[closestZone].center,
            pointOnEllipse,
            point
          )
        ),
        point,
        this.cv.FONT_HERSHEY_SIMPLEX,
        1,
        [0, 0, 0, 255],
        4
      );
      this.cv.putText(
        mat,
        String(
          this.getPoint(
            hashMapVisuels[closestZone].center,
            pointOnEllipse,
            point
          )
        ),
        point,
        this.cv.FONT_HERSHEY_SIMPLEX,
        1,
        [255, 255, 255, 255],
        2
      );
      let impactDTO = new Impact();
      impactDTO.zone = Zone[closestZone as keyof typeof Zone];
      impactDTO.points = this.getPoint(
        hashMapVisuels[closestZone].center,
        pointOnEllipse,
        point
      );
      impactDTO.angle = this.toDegrees(radAngle);
      result.impacts.push(impactDTO);
    }
    result.image = mat;
    console.log('end process');
    console.log(result);
    return result;
  }

  getHashMapVisuels(mat: any) {
    console.log('getHashMapVisuels');
    console.log('getTopLeftTarget');
    let ellipseTopLeft = this.getOuterCircle(this.getTopLeftTarget(mat));
    console.log('getTopRightTarget');
    let ellipseTopRight = this.getOuterCircle(this.getTopRightTarget(mat));
    const width = mat.cols;
    ellipseTopRight.center.x += width / 2;
    console.log('getCenterTarget');
    let ellipseCenter = this.getOuterCircle(this.getCenterTarget(mat));
    ellipseCenter.center.x += mat.cols / 4;
    const height = mat.rows;
    ellipseCenter.center.y += height / 4;
    console.log('getBottomLeftTarget');
    let ellipseBottomLeft = this.getOuterCircle(this.getBottomLeftTarget(mat));
    ellipseBottomLeft.center.y += height / 2;
    console.log('getBottomRightTarget');
    let ellipseBottomRight = this.getOuterCircle(
      this.getBottomRightTarget(mat)
    );
    ellipseBottomRight.center.x += width / 2;
    ellipseBottomRight.center.y += height / 2;
    let ellipseMap: any = {};
    ellipseMap[Zone.TOP_LEFT] = ellipseTopLeft;
    ellipseMap[Zone.TOP_RIGHT] = ellipseTopRight;
    ellipseMap[Zone.CENTER] = ellipseCenter;
    ellipseMap[Zone.BOTTOM_LEFT] = ellipseBottomLeft;
    ellipseMap[Zone.BOTTOM_RIGHT] = ellipseBottomRight;
    console.log('end getHashMapVisuels');
    return ellipseMap;
  }

  getBottomRightTarget(mat: any) {
    console.log('start getBottomRightTarget');
    const img = mat.clone();
    const rectCrop = new this.cv.Rect(
      img.cols / 2,
      img.rows / 2,
      img.cols / 2,
      img.rows / 2
    );
    const croppedImage = img.roi(rectCrop);
    img.delete();
    console.log('end getBottomRightTarget');
    return croppedImage;
  }

  getCenterTarget(mat: any) {
    console.log('start getCenterTarget');
    const img = mat.clone();
    const rectCrop = new this.cv.Rect(
      img.cols / 4,
      img.rows / 4,
      img.cols / 2,
      img.rows / 2
    );
    const croppedImage = img.roi(rectCrop);
    img.delete();
    console.log('end getCenterTarget');
    return croppedImage;
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
