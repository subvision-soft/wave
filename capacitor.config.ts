import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.subapp.app',
  appName: 'subapp',
  webDir: 'dist/subapp',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/SubappDatabase',
      iosIsEncryption: true,
      iosKeychainPrefix: 'angular-sqlite-app-starter',
      iosBiometric: {
        biometricAuth: false,
        biometricTitle: 'Biometric login for capacitor sqlite',
      },
      androidIsEncryption: true,
      androidBiometric: {
        biometricAuth: false,
        biometricTitle: 'Biometric login for capacitor sqlite',
        biometricSubTitle: 'Log in using your biometric',
      },
      electronIsEncryption: false,
      electronWindowsLocation: 'C:\\ProgramData\\SubappDatabases',
      electronMacLocation: '/Volumes/Development_Lacie/Development/Databases',
      electronLinuxLocation: 'Databases',
    },
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
