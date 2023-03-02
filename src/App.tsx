import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { RouterProvider } from 'react-router-dom';
import '@chatui/core/dist/index.css';
import { Toaster } from 'react-hot-toast';

import { router } from './router';
import { lightTheme, darkTheme } from './layout';
import { LoginModal } from '@/components/LoginModal';
import { WalletCheck } from '@/components/LaunchCheck';
import { useNostrStore, useGlobalStore } from './store';
import { useEffect } from 'react';
export default function App() {
  const initRelayList = useNostrStore((state) => state.initRelayList);
  const loading = useGlobalStore((state) => state.checkLoading);
  const { theme } = useTheme();
  console.log(theme);
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
        <div
          className={`sm:mt-30 ${
            theme ? 'sm:bg-coolGray-9' : 'sm:bg-coolGray-1'
          } rounded-xl sm:w-400px mx-auto h-screen sm:h-800px overflow-y-auto`}>
          <LoginModal />
          <WalletCheck />
          <Toaster
            position='top-center'
            reverseOrder={false}
            toastOptions={{ duration: 2000 }}
          />
          {!loading && <RouterProvider router={router}></RouterProvider>}
        </div>
      </NextUIProvider>
    </NextThemesProvider>
  );
}
