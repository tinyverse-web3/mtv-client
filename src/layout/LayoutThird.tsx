import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/form/Button';
export default function Page({
  children,
  path,
  title,
  showBack = true,
  className = '',
  showLogo = true,
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
      <section className='pt-12 h-full overflow-y-auto'>{children}</section>
    </main>
  );
}
