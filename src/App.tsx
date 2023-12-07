import { useEffect } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { RouterProvider, BrowserRouter as Router } from 'react-router-dom';
// import '@chatui/core/dist/index.css';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { router } from '@/router';
import { BindMail } from '@/components/BindMail';

import Container from '@/layout/container';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t } = useTranslation();
  const { VITE_GOOGLE_CLIENT } = import.meta.env;
  useEffect(() => {
    document.title = t('app.title');
  }, []);
  return (
    <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT}>
      <main className='sm:pt-20 h-full'>
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
      </main>
    </GoogleOAuthProvider>
  );
}
