// import '@/styles/index.css';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import fastClick from 'fastclick';
fastClick(document.getElementById('root'));
import App from './App';
import '@/styles/index.css';
import '@/styles/loading.css';
import 'react-photo-view/dist/react-photo-view.css';
import { ChakraProvider } from '@chakra-ui/react';
import '@/locales';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  // </React.StrictMode>,
);
