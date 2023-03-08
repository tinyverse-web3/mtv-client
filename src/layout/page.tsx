import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Avatar } from '@nextui-org/react';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { LogoutIcon } from '@/components/LogoutIcon';

const hideLogoutPath = ['/', '/restore', '/create', '/unlock'];
export default function Page({ children, path, title, showBack = true }: any) {
  const nav = useNavigate();
  const location = useLocation();
  const goBack = async () => {
    nav(path || -1);
  };
  const hideStatsu = useMemo(() => {
    return hideLogoutPath.includes(location.pathname);
  }, [location]);
  return (
    <main className='h-full flex flex-col'>
      <header className='stacky h-14 px-4'>
        <div className='h-full justify-between flex items-center border-black border relative'>
          <div>
            {showBack ? (
              <Button
                light
                size='sm'
                auto
                className='px-3 text-5'
                onPress={goBack}>
                <div className='i-mdi-arrow-left w-6 h-6 z-2'></div>
              </Button>
            ) : (
              <Avatar src='/logo.png' size='xs' className='ml-3' />
            )}
          </div>
          {title && (
            <div className='h-full w-full flex justify-center items-center absolute left-0 top-0 font-700'>
              {title}
            </div>
          )}
          <div className='flex h-full items-center'>
            <ThemeSwitch />
            {!hideStatsu && <LogoutIcon />}
          </div>
        </div>
      </header>
      <section className='py-2 px-4 flex-1 overflow-y-auto'>{children}</section>
    </main>
  );
}
