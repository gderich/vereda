import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Vereda',
  slug: 'vereda-daily-scripture',
  version: '1.3.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'vereda',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#102D39',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.vereda.app',
    buildNumber: '4',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      CFBundleLocalizations: ['pt'],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#102D39',
    },
    package: 'com.vereda.app',
    versionCode: 4,
    blockedPermissions: ['android.permission.RECORD_AUDIO'],
    permissions: [
      'android.permission.INTERNET',
      'android.permission.RECEIVE_BOOT_COMPLETED',
      'android.permission.VIBRATE',
      'android.permission.WAKE_LOCK',
    ],
  },
  web: {
    favicon: './assets/images/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    ['expo-av', { microphonePermission: false }],
    'expo-font',
    'expo-secure-store',
    [
      'expo-notifications',
      {
        icon: './assets/images/notification-icon.png',
        color: '#216653',
        defaultChannel: 'daily-reminder',
      },
    ],
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 220,
        resizeMode: 'contain',
        backgroundColor: '#102D39',
        dark: {
          backgroundColor: '#102D39',
        },
      },
    ],
    [
      'expo-build-properties',
      {
        ios: {
          deploymentTarget: '17.0',
        },
        android: {
          usesCleartextTraffic: false,
          minSdkVersion: 24,
          compileSdkVersion: 34,
          targetSdkVersion: 34,
        },
      },
    ],
    [
      'expo-localization',
      {
        supportedLocales: {
          ios: ['pt'],
          android: ['pt'],
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: 'b246984d-e059-4380-a167-6b139435adb2',
    },
  },
});
