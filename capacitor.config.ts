import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.subapp.app',
  appName: 'subapp',
  webDir: 'dist/subapp',
  server: {
    androidScheme: 'https',
  },
};

export default config;
