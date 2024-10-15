// app.component.ts
import {AfterViewInit, Component, ElementRef, HostListener, inject, OnDestroy, ViewChild,} from '@angular/core';
import {env, InferenceSession, Tensor} from 'onnxruntime-web/wasm';
import {download} from '../../utils/download';
import {detectImage} from '../../utils/detect';
import {NgIf} from '@angular/common';
import {NgxOpenCVService} from '../../../lib/ngx-open-cv.service';
import {LoadingComponent} from '../../components/loading/loading.component';
import {Subscription} from 'rxjs';
import {OpencvImshowComponent} from '../../components/opencv-imshow/opencv-imshow.component';
import {PlastronService} from '../../services/plastron.service';

@Component({
  selector: 'app-camera-preview',
  templateUrl: './camera-preview.component.html',
  styleUrls: ['./camera-preview.component.scss'],
  standalone: true,
  imports: [NgIf, LoadingComponent, OpencvImshowComponent],
})
export class CameraPreviewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('inputImage') inputImage!: ElementRef;
  @ViewChild('imageRef') imageRef!: ElementRef;
  @ViewChild('videoRef') videoRef!: ElementRef;
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('inputCanvasRef') inputCanvasRef!: ElementRef<HTMLCanvasElement>;
  private openCvService: NgxOpenCVService = inject(NgxOpenCVService);

  private plastronService: PlastronService = inject(PlastronService);

  get coordinatesPercent(): any {
    return this._coordinatesPercent;
  }

  set coordinatesPercent(value: any) {
    this._coordinatesPercent = value;
    console.log(this._coordinatesPercent);
    this.path?.nativeElement.setAttribute('d', this.getPath());
  }

  @ViewChild('svg') svg: ElementRef | undefined;
  @ViewChild('path') path: ElementRef | undefined;
  parentHeight: number = 0;
  parentWidth: number = 0;
  private continuous: boolean = false;
  private openCVState: Subscription;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateParentSize();
  }

  private updateParentSize() {
    this.parentHeight = this.videoRef?.nativeElement.offsetHeight;
    this.parentWidth = this.videoRef?.nativeElement.offsetWidth;
  }

  session: any = null;
  loading: { text: string; progress: number | null } | null = {
    text: 'Loading OpenCV.js',
    progress: null,
  };
  image: string | null = null;
  coordinates: any = null;
  private _coordinatesPercent: any = null;
  // Configs
  modelInputShape = [1, 3, 640, 640];
  topk = 100;
  iouThreshold = 0.45;
  scoreThreshold = 0.85;
  private camera_stream: null | MediaStream = null;
  width: number;
  height: number;

  ngAfterViewInit(): void {
    this.updateParentSize()
  }


  coordinatesToPercent(coordinates: any) {
    if (!coordinates) {
      return;
    }
    this.coordinatesPercent = coordinates.map((coordinate: any) => {
      return {
        x: coordinate.x * 100,
        y: coordinate.y * 100,
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

  constructor() {
    this.openCvService.loadOpenCv();
    this.openCVState = this.openCvService.cvState.subscribe((state) => {
      if (state.ready) {
        this.openCVState?.unsubscribe();
        env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/dist/';
        this.loadModel().then(async () => {
          await this.startCamera();
        });
      }
    });
  }

  async startCamera(): Promise<void> {
    this.loading = {text: 'Starting Camera...', progress: null};
    let input_canvas_ctx: CanvasRenderingContext2D | null;
    // capture frame loop
    const capture_frame_continuous = async () => {
      if (!this.continuous || this.loading) return;
      // @ts-ignore
      const cv = window.cv;
      input_canvas_ctx?.drawImage(
        this.videoRef.nativeElement,
        0,
        0,
        this.inputCanvasRef.nativeElement.width,
        this.inputCanvasRef.nativeElement.height
      ); // Draw frame to input <canvas>
      const frame_mat = cv.imread(this.inputCanvasRef.nativeElement); // read frame to Cv.Mat
      this.width = frame_mat.cols;
      this.height = frame_mat.rows;
      const start = performance.now();
      detectImage(
        frame_mat,
        this.canvasRef.nativeElement,
        this.session,
        this.topk,
        this.iouThreshold,
        this.scoreThreshold,
        this.modelInputShape
      ).then((mask) => {
        const end = performance.now();
        console.log('Execution time: ' + (end - start) + 'ms');
        this.coordinates = this.plastronService.getSheetCoordinates(mask);
        console.log('Execution time: ' + (end - start) + 'ms');
        this.coordinatesToPercent(this.coordinates);
        mask.delete();
        requestAnimationFrame(capture_frame_continuous);
      }); // detect
    };

    // get user media
    this.camera_stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: {ideal: 3880},
        height: {ideal: 2160},
      },
      audio: false,
    });
    this.videoRef.nativeElement.srcObject = this.camera_stream; // set to <video>
    input_canvas_ctx = this.inputCanvasRef.nativeElement.getContext('2d', {
      willReadFrequently: true,
    }); // get input <canvas> ctx
    // start frame capture
    this.continuous = true;
    this.loading = null;
    capture_frame_continuous();
  }

  async loadModel(): Promise<void> {
    try {
      const baseModelURL = `${window.location.origin}/assets/models`;
      const options: InferenceSession.SessionOptions = {
        executionProviders: ['wasm'],
      };
      const arrBufYolo = await download(
        `${baseModelURL}/yolov8n-tsc-seg.onnx`,
        ['Loading YOLO model', this.setLoading.bind(this)]
      );
      this.setLoading({text: 'Preheating YOLO model...', progress: null});
      const yolov8 = await InferenceSession.create(arrBufYolo, options);
      const arrBufNMS = await download(`${baseModelURL}/nms-yolov8.onnx`, [
        'Loading NMS model',
        this.setLoading.bind(this),
      ]);

      const nms = await InferenceSession.create(arrBufNMS, options);
      const arrBufMask = await download(
        `${baseModelURL}/mask-yolov8-seg.onnx`,
        ['Loading Mask model', this.setLoading.bind(this)]
      );
      const mask = await InferenceSession.create(arrBufMask, options);

      this.setLoading({text: 'Warming up model...', progress: null});
      const tensor = new Tensor(
        'float32',
        new Float32Array(this.modelInputShape.reduce((a, b) => a * b)),
        this.modelInputShape
      );
      await yolov8.run({images: tensor});
      this.session = {net: yolov8, nms: nms, mask: mask};
      this.setLoading(null);
    } catch (error) {
      console.error(error);
      this.setLoading(null);
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
