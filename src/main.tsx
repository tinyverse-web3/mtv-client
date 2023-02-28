import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'uno.css';
import { WalletCheck } from '@/components/LaunchCheck';


const Test = () => {
  useEffect(() => console.log(123))
  return <div>123</div>
}
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
