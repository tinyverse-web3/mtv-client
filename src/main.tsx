// import '@/styles/index.css';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import fastClick from 'fastclick';
fastClick(document.getElementById('root'));
import App from './App';
import '@/styles/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>,
);
