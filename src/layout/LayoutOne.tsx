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
export default function LayoutOne({
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
    <main className={'h-full relative'}>
      <section className={`h-full pb-12 pt-20 ${className ? className : ''}`}>
        {children}
      </section>
    </main>
  );
}
