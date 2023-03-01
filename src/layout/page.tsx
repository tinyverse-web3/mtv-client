import { useNavigate } from 'react-router-dom';
import { Button, Avatar } from '@nextui-org/react';
import { ThemeSwitch } from '../components/ThemeSwitch';

export default function Page({ children, path, title, showBack = true }: any) {
  const nav = useNavigate();
  const goBack = async () => {
    nav(path || -1);
  };
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
                className='px-1.5 text-5'
                onPress={goBack}>
                <div className='i-mdi-arrow-left w-6 h-6 z-2'></div>
              </Button>
            ): <Avatar src='/logo.png' size='xs' />}
          </div>
          {title && (
            <div className='h-full w-full flex justify-center items-center absolute left-0 top-0 font-700'>
              {title}
            </div>
          )}
          <ThemeSwitch />
        </div>
      </header>
      <section className='py-2 px-4 flex-1 overflow-y-auto'>{children}</section>
    </main>
  );
}
