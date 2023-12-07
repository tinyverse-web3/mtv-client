export {};
declare global {
  interface Window {
    mtvStorage: any;
    JsBridge: any;
    VConsole: any;
    onTelegramAuth: any;
  }
  interface globalThis {
    mtvStorage: any;
    JsBridge: any;
    onTelegramAuth: any;
  }
}
