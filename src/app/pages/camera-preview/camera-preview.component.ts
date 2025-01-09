// app.component.ts
import {Component, computed, ElementRef, inject, OnDestroy, signal, ViewChild,} from '@angular/core';
import {NgIf} from '@angular/common';
import {LoadingComponent} from '../../components/loading/loading.component';
import {lastValueFrom, Subscription} from 'rxjs';
import "@tensorflow/tfjs-backend-webgl";
import {HttpClient} from '@angular/common/http';
import {EndpointsUtils} from '../../utils/EndpointsUtils';
import {CaptureButton} from '../../components/capture-button/capture-button.component';
import {Router} from '@angular/router';
import {compressImage, getImageSize} from '../../utils/image'; // set backend to webgl


type Coordinates = {
  x: number; y: number;

};

@Component({
  selector: 'app-camera-preview',
  templateUrl: './camera-preview.component.html',
  styleUrls: ['./camera-preview.component.scss'],
  standalone: true,
  imports: [NgIf, LoadingComponent, CaptureButton],
})
export class CameraPreviewComponent implements OnDestroy {
  private static readonly MAX_FPS = 5;
  protected readonly CORRECT_COORDINATES_BEFORE_PROCESS = 10;
  private static readonly PREPROCESSING_SIZE = 500;
  @ViewChild('videoRef') videoRef!: ElementRef;
  @ViewChild('inputCanvasRef') inputCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('svg') svg: ElementRef | undefined;
  private input_canvas_ctx: CanvasRenderingContext2D | null;


  private readonly router: Router = inject(Router);


  protected videoWidth = signal<number>(0);
  protected videoHeight = signal<number>(0);
  protected aspectRatio = computed((): number => {
    return this.videoWidth() / this.videoHeight();
  });

  protected viewBox = computed<string>(() => {
      return `0 0 ${this.videoWidth()} ${this.videoHeight()}`;
    }
  );

  loading: { text: string; progress: number | null } | null = {
    text: 'Loading OpenCV.js', progress: null,
  };
  image: string | null = null;
  coordinates = signal<Coordinates[]>([]);
  coordinatesPercent = computed<Coordinates[]>(() => {
    return this.coordinates().map((coordinate: any): Coordinates => {
      return {
        x: coordinate.x * 100, y: coordinate.y * 100,
      };
    })
  });
  numberOfValidCoordinates = signal<number>(0);


  // Configs
  modelInputShape = [1, 3, 640, 640];
  protected path = computed<string>(() => {
    if (!this.coordinates()) {
      return '';
    }

    let result = '';
    for (const coordinate of this.coordinates()) {
      result += `${this.videoWidth() * coordinate.x},${this.videoHeight() * coordinate.y} `;
    }

    if (result.length < 2) {
      return '';
    }

    return `M ${result.slice(0, -1)} Z`;
  });
  private readonly http: HttpClient = inject(HttpClient);
  private continuous: boolean = false;
  private openCVState: Subscription;
  private camera_stream: null | MediaStream = null;

  constructor() {
    this.startCamera();
  }


  async getImageBase64(fullSize: boolean = false): Promise<string> {
    this.inputCanvasRef.nativeElement.width = fullSize ? this.videoRef.nativeElement.videoWidth : CameraPreviewComponent.PREPROCESSING_SIZE;
    this.inputCanvasRef.nativeElement.height = fullSize ? this.videoRef.nativeElement.videoHeight : CameraPreviewComponent.PREPROCESSING_SIZE;
    this.input_canvas_ctx?.drawImage(this.videoRef.nativeElement, 0, 0, this.inputCanvasRef.nativeElement.width, this.inputCanvasRef.nativeElement.height);
    let base64Image = this.inputCanvasRef.nativeElement.toDataURL('image/jpeg');

    if (fullSize) {
      let imageSize = getImageSize(base64Image);
      while (imageSize > 50000) {
        const beforeSize = imageSize;
        base64Image = await compressImage(base64Image);
        imageSize = getImageSize(base64Image);

        if (beforeSize === imageSize) {
          break;
        }
      }
    }

    return base64Image.replace('data:image/jpeg;base64,', '');
  }


  async startCamera(): Promise<void> {
    console.log('Starting Camera...');
    this.loading = {text: 'Starting Camera...', progress: null};
    // capture frame loop
    const capture_frame_continuous = async () => {
      const start = performance.now();
      this.videoWidth.set(this.videoRef.nativeElement.videoWidth);
      this.videoHeight.set(this.videoRef.nativeElement.videoHeight);
      if (!this.continuous || this.loading) return;
      const coordinates: number[][] = await lastValueFrom(this.http.post<number[][]>(EndpointsUtils.getPathDetectTarget(), {
        image_data: await this.getImageBase64(),
      }));
      const lastCoordinates = this.coordinates();
      this.coordinates.set(coordinates.map((coordinate: number[]): Coordinates => {
        return {
          x: coordinate[0], y: coordinate[1],
        };
      }));
      this.numberOfValidCoordinates.update((value) => {
        if (this.coordinates()?.length && lastCoordinates?.length) {
          const currentCoordinates = this.coordinates();
          const lastCentroid = lastCoordinates.reduce((acc, coordinate) => {
              return {x: acc.x + coordinate.x, y: acc.y + coordinate.y};
            }
            , {x: 0, y: 0});
          lastCentroid.x /= currentCoordinates.length;
          lastCentroid.y /= currentCoordinates.length;
          const currentCentroid = currentCoordinates.reduce((acc, coordinate) => {
              return {x: acc.x + coordinate.x, y: acc.y + coordinate.y};
            }
            , {x: 0, y: 0});
          currentCentroid.x /= coordinates.length;
          currentCentroid.y /= coordinates.length;
          const distance = Math.sqrt(Math.pow(currentCentroid.x - lastCentroid.x, 2) + Math.pow(currentCentroid.y - lastCentroid.y, 2));
          if (Math.abs(distance) > 0.1) {
            return 0;
          }
        }


        return this.coordinates()?.length ? Math.min(value + 1, this.CORRECT_COORDINATES_BEFORE_PROCESS) : 0;
      });


      const end = performance.now();
      setTimeout(() => {
        requestAnimationFrame(capture_frame_continuous)
      }, 1000 / CameraPreviewComponent.MAX_FPS - (end - start));
    };

    // get user media
    this.camera_stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', width: {ideal: 3880}, height: {ideal: 2160},
      }, audio: false,
    });
    this.videoRef.nativeElement.srcObject = this.camera_stream; // set to <video>
    this.input_canvas_ctx = this.inputCanvasRef.nativeElement.getContext('2d', {
      willReadFrequently: true,
    }); // get input <canvas> ctx
    // start frame capture
    this.continuous = true;
    this.loading = null;
    this.setLoading(null);
    await capture_frame_continuous();
  }


  async capture(): Promise<void> {
    if (this.CORRECT_COORDINATES_BEFORE_PROCESS <= this.numberOfValidCoordinates()) {
      // this.numberOfValidCoordinates.set(0);
      const imageBase64 = await this.getImageBase64(true);
      console.log('Image Base64:', imageBase64);
      const data = await lastValueFrom(this.http.post(EndpointsUtils.getPathTargetScore(), {
        image_data: imageBase64,
      }));

      this.router.navigate(['/camera/result'], {state: {data}});
    }

  }

  setLoading(loading: { text: string; progress: number | null } | null): void {
    this.loading = loading;
  }

  ngOnDestroy(): void {
    this.openCVState?.unsubscribe();
    this.camera_stream?.getTracks()?.forEach((track) => track.stop());
    this.videoRef.nativeElement.srcObject = null;
    this.camera_stream = null;
    this.continuous = false;
  }
}
