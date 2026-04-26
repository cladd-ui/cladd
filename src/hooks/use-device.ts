let deviceCalculated: ReturnType<typeof calcDevice> | null = null;

interface DeviceInfo {
  ios: boolean;
  android: boolean;
  desktop: boolean;
  mobile: boolean;
  iphone: boolean;
  ipod: boolean;
  ipad: boolean;
}

function calcDevice({ userAgent }: { userAgent?: string } = {}): DeviceInfo {
  const supportTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window ||
      ((window as any).DocumentTouch &&
        document instanceof (window as any).DocumentTouch));
  const platform = window.navigator.platform;
  const ua = userAgent || window.navigator.userAgent;

  const device: DeviceInfo = {
    ios: false,
    android: false,
    desktop: false,
    mobile: false,
    iphone: false,
    ipod: false,
    ipad: false,
  };

  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone =
    !ipad && ua.match(/(iPhone\sOS|iOS|iPhone;\sCPU\sOS)\s([\d_]+)/);

  const electron = ua.toLowerCase().indexOf("electron") >= 0;
  const nwjs =
    typeof (window as any).nw !== "undefined" &&
    // @ts-ignore
    typeof process !== "undefined" &&
    // @ts-ignore
    typeof process.versions !== "undefined" &&
    // @ts-ignore
    typeof process.versions.nw !== "undefined";
  let macos = platform === "MacIntel";

  if (!ipad && macos && supportTouch) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad) ipad = ["", "Version", "13_0_0"] as RegExpMatchArray;
    macos = false;
  }

  // Android
  if (android) {
    device.android = true;
  }
  if (ipad || iphone || ipod) {
    device.ios = true;
  }
  // iOS
  if (iphone && !ipod) {
    device.iphone = true;
  }
  if (ipad) {
    device.ipad = true;
  }
  if (ipod) {
    device.ipod = true;
  }

  // Desktop
  device.desktop = !(device.ios || device.android) || electron || nwjs;

  // mobile
  device.mobile = device.ios || device.android;

  // Export object
  return device;
}

function useDevice(
  overrides: { userAgent?: string } = {},
  reset?: boolean,
): DeviceInfo {
  if (!deviceCalculated || reset) {
    deviceCalculated = calcDevice(overrides);
  }
  return deviceCalculated;
}

export { useDevice };
