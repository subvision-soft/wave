import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.subapp.app',
  appName: 'subapp',
  webDir: 'dist/subapp',
  server: {
    androidScheme: 'https',
  },
  cordova: {
    preferences: {
      LottieFullscreen: 'true',
      LottieHideAfterAnimationEnd: 'true',
      LottieAnimationLocation: 'public/assets/subapp.json',
      LottieFadeOutDuration: '1000',
    },
  },
};

export default config;
