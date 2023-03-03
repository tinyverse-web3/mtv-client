import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { RouterProvider } from 'react-router-dom';
import '@chatui/core/dist/index.css';
import { Toaster } from 'react-hot-toast';

import { router } from '@/router';
import { lightTheme, darkTheme } from '@/layout';
import { LoginModal } from '@/components/LoginModal';
import { WalletCheck } from '@/components/LaunchCheck';
import Container from '@/layout/container';
import { useNostrStore, useGlobalStore } from '@/store';
import { useEffect } from 'react';
export default function App() {
  const initRelayList = useNostrStore((state) => state.initRelayList);
  const loading = useGlobalStore((state) => state.checkLoading);
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
    <main className='sm:pt-20'>
      <NextThemesProvider
        defaultTheme='system'
        attribute='class'
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}>
        <NextUIProvider>
          <Container>
            <LoginModal />
            <WalletCheck />
            <Toaster
              position='top-center'
              reverseOrder={false}
              toastOptions={{ duration: 2000 }}
            />
            {!loading && <RouterProvider router={router}></RouterProvider>}
          </Container>
        </NextUIProvider>
      </NextThemesProvider>
    </main>
  );
}
