import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { RouterProvider } from 'react-router-dom';
import '@chatui/core/dist/index.css';
import { Toaster } from 'react-hot-toast';

import { router } from './router';
import { lightTheme, darkTheme } from './layout';
import { LoginModal } from '@/components/LoginModal';

import { useNostrStore } from './store';
import { useEffect } from 'react';
export default function App() {
  const initRelayList = useNostrStore((state) => state.initRelayList);
  useEffect(() => {
    initRelayList([
      {
        wss: 'wss://relay.snort.social',
      },
      {
        wss: 'wss://relay.damus.io',
      },
      {
        wss: 'wss://nostr.yuv.al',
      },
      {
        wss: 'wss://nos.lol',
      },
      {
        wss: 'wss://nostr.snblago.com',
      },
      {
        wss: 'wss://nostr.0ne.day',
      },
      {
        wss: 'wss://relay.nostr.scot',
      },
      {
        wss: 'wss://nostr.yuv.al',
      },
    ]);
  }, []);
  return (
    <NextThemesProvider
      defaultTheme='system'
      attribute='class'
      value={{
        light: lightTheme.className,
        dark: darkTheme.className,
      }}>
      <NextUIProvider>
        <div className='max-w-md px-4 mx-auto h-screen md:h-800px max-h-800px overflow-y-auto'>
        <LoginModal />
          <Toaster
            position='top-center'
            reverseOrder={false}
            toastOptions={{ duration: 2000 }}
          />
          
          <RouterProvider router={router}></RouterProvider>
        </div>
      </NextUIProvider>
    </NextThemesProvider>
  );
}
