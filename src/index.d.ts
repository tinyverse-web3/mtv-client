export {};
declare global {
  interface Window {
    mtvStorage: any;
    JsBridge: any;
  }
  interface globalThis {
    mtvStorage: any;
    JsBridge: any;
  }
}
