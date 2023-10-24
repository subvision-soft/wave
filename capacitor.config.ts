import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.subapp.app',
  appName: 'wave',
  webDir: 'dist/subapp',
  server: {
    androidScheme: 'https',
    // url: 'http://192.168.1.40:4200',
    // cleartext: true,
  },

  cordova: {
    preferences: {
      LottieFullscreen: 'true',
      LottieHideAfterAnimationEnd: 'true',
      LottieAnimationLocation: 'public/assets/wave.json',
      LottieFadeOutDuration: '1000',
    },
  },
};

export default config;
