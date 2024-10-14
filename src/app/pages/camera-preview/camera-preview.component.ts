// app.component.ts
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { env, InferenceSession, Tensor } from 'onnxruntime-web';
import { download } from '../../utils/download';
import { detectImage } from '../../utils/detect';
import { NgIf } from '@angular/common';
import { NgxOpenCVService } from '../../../lib/ngx-open-cv.service';

@Component({
  selector: 'app-camera-preview',
  templateUrl: './camera-preview.component.html',
  styleUrls: ['./camera-preview.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class CameraPreviewComponent implements OnInit {
  @ViewChild('inputImage') inputImage!: ElementRef;
  @ViewChild('imageRef') imageRef!: ElementRef;
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;
  private openCvService: NgxOpenCVService = inject(NgxOpenCVService);

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

  ngOnInit(): void {
    this.openCvService.loadOpenCv();
    this.openCvService.cvState.subscribe((state) => {
      if (state.ready) {
        env.wasm.wasmPaths = '/assets/';
        this.loadModel();
      }
    });
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
}
