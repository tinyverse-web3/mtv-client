export {};
declare global {
  interface Window {
    mtvStorage: any;
    JsBridge: any;
    VConsole: any;
  }
  interface globalThis {
    mtvStorage: any;
    JsBridge: any;
  }
}
