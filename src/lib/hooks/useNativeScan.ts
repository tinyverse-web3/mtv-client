import { useState, useEffect } from 'react';
export const useNativeScan = () => {
  const [result, setResult] = useState('');
  const nativeScan = (result: any) => {
    if (result.data) {
      setResult(result.data);
    }
  };
  const start = () => {
    if (window.JsBridge) {
      console.log('native scan');
      window.JsBridge.startQrcodeScanActivity(nativeScan);
    }
  };
  return { start, result };
};
