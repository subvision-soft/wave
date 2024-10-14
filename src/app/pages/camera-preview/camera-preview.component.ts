// app.component.ts
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { env, InferenceSession, Tensor } from 'onnxruntime-web';
import { download } from '../../utils/download';
import { detectImage } from '../../utils/detect';
import { NgIf } from '@angular/common';
import { NgxOpenCVService } from '../../../lib/ngx-open-cv.service';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-camera-preview',
  templateUrl: './camera-preview.component.html',
  styleUrls: ['./camera-preview.component.scss'],
  standalone: true,
  imports: [NgIf, LoadingComponent],
})
export class CameraPreviewComponent implements OnInit, OnDestroy {
  @ViewChild('inputImage') inputImage!: ElementRef;
  @ViewChild('imageRef') imageRef!: ElementRef;
  @ViewChild('videoRef') videoRef!: ElementRef;
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('inputCanvasRef') inputCanvasRef!: ElementRef<HTMLCanvasElement>;
  private openCvService: NgxOpenCVService = inject(NgxOpenCVService);
  parentHeight: number = 0;
  parentWidth: number = 0;

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

  // Configs
  modelName = 'yolov8n-tsc-seg.onnx';
  modelInputShape = [1, 3, 640, 640];
  topk = 100;
  iouThreshold = 0.45;
  scoreThreshold = 0.85;
  private camera_stream: null | MediaStream = null;
  width: number;
  height: number;

  ngOnInit(): void {
    this.openCvService.loadOpenCv();
    this.openCvService.cvState.subscribe((state) => {
      if (state.ready) {
        env.wasm.wasmPaths = '/assets/';
        this.loadModel().then(() => {
          this.startCamera();
        });
      }
    });
  }

  async startCamera(): Promise<void> {
    this.loading = { text: 'Starting Camera...', progress: null };
    let continuous: boolean;
    let input_canvas_ctx: CanvasRenderingContext2D | null;
    // capture frame loop
    const capture_frame_continuous = async () => {
      if (!continuous) return;
      this.loading = null;
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
      detectImage(
        frame_mat,
        this.canvasRef.nativeElement,
        this.session,
        this.topk,
        this.iouThreshold,
        this.scoreThreshold,
        this.modelInputShape
      ); // detect

      requestAnimationFrame(capture_frame_continuous); // loop
    };

    if (this.camera_stream) {
      // stop camera
      this.camera_stream.getTracks().forEach((track) => track.stop());
      this.videoRef.nativeElement.srcObject = null;
      this.camera_stream = null;
      continuous = false;
    } else {
      // get user media
      this.camera_stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      this.videoRef.nativeElement.srcObject = this.camera_stream; // set to <video>
      input_canvas_ctx = this.inputCanvasRef.nativeElement.getContext('2d', {
        willReadFrequently: true,
      }); // get input <canvas> ctx
      // start frame capture
      continuous = true;
      capture_frame_continuous();
    }
  }

  async loadModel(): Promise<void> {
    try {
      const baseModelURL = `${window.location.origin}/assets/models`;

      const arrBufNMS = await download(`${baseModelURL}/nms-yolov8.onnx`, [
        'Loading NMS model',
        this.setLoading.bind(this),
      ]);
      const nms = await InferenceSession.create(arrBufNMS, {
        executionProviders: ['wasm'],
      });

      const arrBufYolo = await download(
        `${baseModelURL}/yolov8n-tsc-seg.onnx`,
        ['Loading YOLO model', this.setLoading.bind(this)]
      );
      const yolov8 = await InferenceSession.create(arrBufYolo);

      const arrBufMask = await download(
        `${baseModelURL}/mask-yolov8-seg.onnx`,
        ['Loading Mask model', this.setLoading.bind(this)]
      );
      const mask = await InferenceSession.create(arrBufMask);

      this.setLoading({ text: 'Warming up model...', progress: null });
      const tensor = new Tensor(
        'float32',
        new Float32Array(this.modelInputShape.reduce((a, b) => a * b)),
        this.modelInputShape
      );
      await yolov8.run({ images: tensor });
      this.session = { net: yolov8, nms: nms, mask: mask };
      this.setLoading(null);
    } catch (error) {
      console.error(error);
      this.setLoading(null);
    }
  }

  setLoading(loading: { text: string; progress: number | null } | null): void {
    this.loading = loading;
  }

  handleImageChange(event: any): void {
    if (this.image) {
      URL.revokeObjectURL(this.image);
      this.image = null;
    }

    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      this.imageRef.nativeElement.src = url;
      this.image = url;
    }
  }

  openLocalImage(): void {
    this.inputImage.nativeElement.click();
  }

  closeImage(): void {
    this.inputImage.nativeElement.value = '';
    this.imageRef.nativeElement.src = '#';
    URL.revokeObjectURL(this.image!);
    this.image = null;
  }

  onImageLoad(): void {
    if (this.image) {
      detectImage(
        this.imageRef.nativeElement,
        this.canvasRef.nativeElement,
        this.session,
        this.topk,
        this.iouThreshold,
        this.scoreThreshold,
        this.modelInputShape
      );
    }
  }

  ngOnDestroy(): void {}
}
