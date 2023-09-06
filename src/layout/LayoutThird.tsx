import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/form/Button';
import { SpinLoading } from '@/components/SpinLoading';

export default function Page({
  children,
  path,
  title,
  showBack = true,
  className = '',
  showLogo = true,
  loading = false,
  rightContent,
}: any) {
  const nav = useNavigate();
  const goBack = () => {
    nav(path || -1);
  };
  return (
    <main className='h-full relative'>
      <header className='h-12 absolute top-0 left-0 w-full border-b border-b-solid border-b-gray-200 px-2 flex justify-between items-center z-10 bg-white z-9999'>
        <div className='w-10'>
          <div className='px-3 text-5' onClick={goBack}>
            <div className='i-mdi-arrow-left w-6 h-6 z-2'></div>
          </div>
        </div>
        <div className='flex-1 text-center font-600'>{title}</div>
        <div className='w-10'>{rightContent && rightContent}</div>
      </header>
      <section className='pt-12 h-full overflow-y-auto relative'>
        {children}
        {loading && (
          <SpinLoading className='absolute top-1/2 left-1/2 -translate-1/2  z-99999' />
        )}
        <SpinLoading className='absolute top-1/2 left-1/2 -translate-1/2  z-99999' />
      </section>
    </main>
  );
}
