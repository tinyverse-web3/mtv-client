import { useEffect } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { RouterProvider, BrowserRouter as Router } from 'react-router-dom';
// import '@chatui/core/dist/index.css';
import { Toaster } from 'react-hot-toast';

import { router } from '@/router';
import { lightTheme, darkTheme } from '@/layout';
import { BindMail } from '@/components/BindMail';

import Container from '@/layout/container';
import { useGlobalStore } from '@/store';
import { useTranslation } from 'react-i18next';
export default function App() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('app.title');
  }, []);
  return (
    <main className='sm:pt-20 h-full'>
      <NextThemesProvider
        defaultTheme='light'
        attribute='class'
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}>
        <NextUIProvider>
          <Container>
            <BindMail />
            <Toaster
              containerStyle={{ zIndex: 9999999, wordBreak: 'break-all' }}
              position='top-center'
              reverseOrder={false}
              toastOptions={{
                duration: 2000,
              }}
            />
            <RouterProvider router={router}></RouterProvider>
          </Container>
        </NextUIProvider>
      </NextThemesProvider>
    </main>
  );
}
