import { useState, useEffect } from 'react';
export const useHost = () => {
  const [host, setHost] = useState('');
  const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
  const apiHost = window.JsBridge ? VITE_SDK_LOCAL_HOST : VITE_SDK_HOST;
  useEffect(() => {
    setHost(apiHost);
  }, []);
  return host;
};
