import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.subapp.app',
  appName: 'calypso',
  webDir: 'dist/subapp',
  server: {
    androidScheme: 'https',
    // url: 'http://192.168.1.40:4200',
    // cleartext: true,
  },
};

export default config;
