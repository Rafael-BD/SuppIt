import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.suppit.app',
  appName: 'supp-it',
  webDir: 'out',
  server: {
    androidScheme: "https",
  },
};

export default config;
