import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Button } from '@nextui-org/react';
export default function Page({
  children,
  path,
  title,
  showBack = true,
  className = '',
  showLogo = true,
  rightContent
}: any) {
  const nav = useNavigate();
  const location = useLocation();
  const goBack = () => {
    nav(path || -1);
  };
  return (
    <main className={''}>
      <header className='h-12 sticky top-0 left-0 w-full border-b border-b-solid border-b-gray-200 px-2 flex justify-between items-center z-10'>
        <div className='w-10'>
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
            showLogo && <Avatar src='/logo.png' size='xs' className='ml-3' />
          )}
        </div>
        <div className='flex-1 text-center font-600'>{title}</div>
        <div className='w-10'>
          {rightContent && rightContent}
        </div>
      </header>
      <section className='pb-12'>{children}</section>
    </main>
  );
}
