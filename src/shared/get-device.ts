let deviceCalculated: ReturnType<typeof calcDevice> | null = null;

interface DeviceInfo {
  ios: boolean;
  android: boolean;
  androidChrome: boolean;
  desktop: boolean;
  mobile: boolean;
  iphone: boolean;
  ipod: boolean;
  ipad: boolean;
  edge: boolean;
  ie: boolean;
  firefox: boolean;
  macos: boolean;
  windows: boolean;
  cordova: boolean;
  electron: boolean;
  capacitor: boolean;
  nwjs: boolean;
  os?: string;
  osVersion?: string | null;
  webView?: boolean;
  webview?: boolean;
  standalone?: boolean;
  pixelRatio: number;
  prefersColorScheme: () => 'light' | 'dark' | undefined;
}

function calcDevice({ userAgent }: { userAgent?: string } = {}): DeviceInfo {
  const supportTouch =
    'ontouchstart' in window ||
    ((window as any).DocumentTouch &&
      document instanceof (window as any).DocumentTouch);
  const platform = window.navigator.platform;
  const ua = userAgent || window.navigator.userAgent;

  const device: DeviceInfo = {
    ios: false,
    android: false,
    androidChrome: false,
    desktop: false,
    mobile: false,
    iphone: false,
    ipod: false,
    ipad: false,
    edge: false,
    ie: false,
    firefox: false,
    macos: false,
    windows: false,
    cordova: !!(window as any).cordova,
    electron: false,
    capacitor: !!(window as any).Capacitor,
    nwjs: false,
    pixelRatio: window.devicePixelRatio || 1,
    prefersColorScheme: function prefersColorTheme() {
      let theme: 'light' | 'dark' | undefined;
      const LIGHT = '(prefers-color-scheme: light)';
      const DARK = '(prefers-color-scheme: dark)';
      if (window.matchMedia && window.matchMedia(LIGHT).matches) {
        theme = 'light';
      }
      if (window.matchMedia && window.matchMedia(DARK).matches) {
        theme = 'dark';
      }
      return theme;
    },
  };

  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone =
    !ipad && ua.match(/(iPhone\sOS|iOS|iPhone;\sCPU\sOS)\s([\d_]+)/);

  const ie = ua.indexOf('MSIE ') >= 0 || ua.indexOf('Trident/') >= 0;
  const edge = ua.indexOf('Edge/') >= 0;
  const firefox = ua.indexOf('Gecko/') >= 0 && ua.indexOf('Firefox/') >= 0;
  const windows = platform === 'Win32';
  const electron = ua.toLowerCase().indexOf('electron') >= 0;
  const nwjs =
    typeof (window as any).nw !== 'undefined' &&
    // @ts-ignore
    typeof process !== 'undefined' &&
    // @ts-ignore
    typeof process.versions !== 'undefined' &&
    // @ts-ignore
    typeof process.versions.nw !== 'undefined';
  let macos = platform === 'MacIntel';

  if (!ipad && macos && supportTouch) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad) ipad = ['', 'Version', '13_0_0'] as RegExpMatchArray;
    macos = false;
  }

  device.ie = ie;
  device.edge = edge;
  device.firefox = firefox;

  // Android
  if (android) {
    device.os = 'android';
    device.osVersion = android[2];
    device.android = true;
    device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
  }
  if (ipad || iphone || ipod) {
    device.os = 'ios';
    device.ios = true;
  }
  // iOS
  if (iphone && !ipod) {
    device.osVersion = iphone[2].replace(/_/g, '.');
    device.iphone = true;
  }
  if (ipad) {
    device.osVersion = ipad[2].replace(/_/g, '.');
    device.ipad = true;
  }
  if (ipod) {
    device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
    device.ipod = true;
  }
  // iOS 8+ changed UA
  if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
    if (device.osVersion.split('.')[0] === '10') {
      device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
    }
  }

  // Webview
  device.webView =
    !!(
      (iphone || ipad || ipod) &&
      (ua.match(/.*AppleWebKit(?!.*Safari)/i) ||
        (window.navigator as any).standalone)
    ) ||
    (window.matchMedia &&
      window.matchMedia('(display-mode: standalone)').matches);
  device.webview = device.webView;
  device.standalone = device.webView;

  // Desktop
  device.desktop = !(device.ios || device.android) || electron || nwjs;
  if (device.desktop) {
    device.electron = electron;
    device.nwjs = nwjs;
    device.macos = macos;
    device.windows = windows;
    if (device.macos) {
      device.os = 'macos';
    }
    if (device.windows) {
      device.os = 'windows';
    }
  }

  // mobile
  device.mobile = device.ios || device.android;

  // Export object
  return device;
}

function getDevice(
  overrides: { userAgent?: string } = {},
  reset?: boolean,
): DeviceInfo {
  if (!deviceCalculated || reset) {
    deviceCalculated = calcDevice(overrides);
  }
  return deviceCalculated;
}

export { getDevice };
