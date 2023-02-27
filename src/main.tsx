import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'uno.css';
import { WalletCheck } from '@/components/LaunchCheck';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WalletCheck />
    <App />
  </React.StrictMode>,
);
