import {Inject, Injectable, InjectionToken, NgZone} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {OpenCVConfig, OpenCVState} from './models';

export const OpenCvConfigToken = new InjectionToken<OpenCVConfig>(
  'OpenCV config object token', {
    providedIn: 'root',
    factory: () => ({}),
  }
);

@Injectable({
  providedIn: 'root',
})
export class NgxOpenCVService {
  cvState = new BehaviorSubject<OpenCVState>({
    ready: false,
    error: false,
    loading: false,
    state: '',
  });
  configModule: OpenCvConfigModule;

  constructor(
    @Inject(OpenCvConfigToken) options: OpenCVConfig,
    private _ngZone: NgZone
  ) {
    if (!options) {
      options = {};
    }
    this.configModule = this.generateConfigModule(options);
    if (this.cvState.value.loading) {
      return;
    }
    this.loadOpenCv();
  }

  /**
   * load the OpenCV script
   */
  loadOpenCv() {
    console.log('loading OpenCV.js');
    this.cvState.next(this.newState('loading'));
    // create global module variable
    // @ts-ignore
    window['Module'] = this.configModule;

    //check if script already exists
    const scriptElement = document.getElementById('opencv-module');
    if (scriptElement) {
      return;
    }

    // create script element and set attributes
    const script = <HTMLScriptElement>document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('id', 'opencv-module');

    // listen for errors
    script.addEventListener(
      'error',
      () => {
        const err = new Error('Failed to load ' + this.configModule.scriptUrl);
        this.cvState.next(this.newState('error'));
        this.cvState.error(err);
      },
      {passive: true}
    );

    // set script url
    script.src = this.configModule.scriptUrl;
    // insert script as first script tag
    const node = document.getElementsByTagName('script')[0];
    if (node) {
      // @ts-ignore
      node.parentNode.insertBefore(script, node);
    } else {
      document.head.appendChild(script);
    }
  }

  /**
   * generates a new state object
   * @param change - the new state of the module
   */
  private newState(change: 'loading' | 'ready' | 'error'): OpenCVState {
    const newStateObj: OpenCVState = {
      ready: false,
      loading: false,
      error: false,
      state: '',
    };
    Object.keys(newStateObj).forEach((key) => {
      if (key !== 'state') {
        if (key === change) {
          newStateObj[key] = true;
          newStateObj.state = key;
        }
        // else {
        //   newStateObj[key] = false;
        // }
      }
    });
    return newStateObj;
  }

  /**
   * generates a config module for the global Module object
   * @param options - configuration options
   */
  private generateConfigModule(options: OpenCVConfig): OpenCvConfigModule {
    return {
      scriptUrl: options.openCVDirPath
        ? `${options.openCVDirPath}/opencv.js`
        : `/assets/opencv/opencv.js`,
      wasmBinaryFile: 'opencv_js.wasm',
      usingWasm: true,
      onRuntimeInitialized: () => {
        console.log('OpenCV.js is ready');
        this._ngZone.run(() => {
          console.log('openCV Ready');
          this.cvState.next(this.newState('ready'));

          // @ts-ignore
          window['cv'].then((cv) => {
            console.log(cv);
          });

          if (options.runOnOpenCVInit) {
            options.runOnOpenCVInit();
          }
        });
      },
    };
  }
}

/**
 * describes the global Module object that is used to initiate OpenCV.js
 */
interface OpenCvConfigModule {
  scriptUrl: string;
  wasmBinaryFile: string;
  usingWasm: boolean;
  onRuntimeInitialized: Function;
}
