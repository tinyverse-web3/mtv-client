import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Avatar } from '@nextui-org/react';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { LogoutIcon } from '@/components/LogoutIcon';
import { HeaderUser } from '@/components/header/HeaderUser';

const hideLogoutPath = ['/', '/restore', '/create', '/unlock'];
const MenuItem = ({ text }: any) => {
  return (
    <div className='flex flex-col h-full items-center justify-center text-3'>
      <span>{text}</span>
    </div>
  );
};
export default function LayoutTwo({
  children,
  path,
  title,
  showBack = true,
  className = '',
  showLogo = true,
}: any) {
  const nav = useNavigate();
  const location = useLocation();
  const goBack = async () => {
    nav(path || -1);
  };
  const hideStatsu = useMemo(() => {
    return hideLogoutPath.includes(location.pathname);
  }, [location]);

  const footerMenus = [{ text: '空间' }, { text: '密信' }, { text: '资产' }];
  return (
    <main className={'h-full'}>
      <header className='h-20 fixed top-0 left-0 w-full border-b border-b-solid border-b-coolGray'>
        <HeaderUser />
      </header>
      <section className='px-4 h-full pb-12 pt-20'>{children}</section>
      <footer className='h-12 fixed bottom-0 left-0 w-full border-t border-t-solid border-t-coolGray'>
        <div className='h-full flex items-center justify-around'>
          {footerMenus.map(v => <MenuItem key={v.text} text={v.text}/>)}
        </div>
      </footer>
    </main>
  );
}
