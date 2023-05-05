import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'subapp',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: "http://192.168.1.42:8100",
    cleartext: true
  }
};

export default config;
