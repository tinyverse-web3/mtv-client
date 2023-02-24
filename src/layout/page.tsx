import { useNavigate } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import { ThemeSwitch } from '../components/ThemeSwitch';

export default function Page({ children, path, title, showBack = true }: any) {
  const nav = useNavigate();
  const goBack = async () => {
    nav(path || -1);
  };
  return (
    <main className='h-full flex flex-col'>
      <header className='stacky h-12 '>
        <div className='h-full justify-between flex items-center border-black border relative'>
          <div>
            {showBack && (
              <Button
                light
                size='sm'
                auto
                className='px-1.5 text-5'
                onPress={goBack}>
                <div className='i-mdi-arrow-left w-6 h-6 z-2'></div>
              </Button>
            )}
          </div>
          {title && (
            <div className='h-full w-full flex justify-center items-center absolute left-0 top-0'>
              {title}
            </div>
          )}
          <ThemeSwitch />
        </div>
      </header>
      <section className='pt-4 flex-1'>{children}</section>
    </main>
  );
}
