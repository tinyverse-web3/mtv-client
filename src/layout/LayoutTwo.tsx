import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Avatar } from '@nextui-org/react';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { LogoutIcon } from '@/components/LogoutIcon';
import { HeaderUser } from '@/components/header/HeaderUser';
import { ROUTE_PATH } from '@/router';

const hideLogoutPath = ['/', '/restore', '/create', '/unlock'];
const MenuItem = ({ text, path, icon }: any) => {
  const nav = useNavigate();
  const menuClick = () => {
    path && nav(path);
  };
  return (
    <div
      className='flex flex-col h-full items-center justify-center text-3'
      onClick={menuClick}>
      <div className={`${icon} w-6 h-6 mb-1`}></div>
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

  const footerMenus = [
    { text: '空间', path: ROUTE_PATH.SPACE_INDEX, icon: 'i-mdi-cube' },
    {
      text: '密信',
      path: ROUTE_PATH.CHAT_LIST,
      icon: 'i-mdi-message-reply-text',
    },
    {
      text: '资产',
      path: ROUTE_PATH.SPACE_INDEX,
      icon: 'i-mdi-database-settings-outline',
    },
  ];
  return (
    <main className={'h-full'}>
      <header className='h-20 fixed top-0 left-0 w-full border-b border-b-solid border-b-gray-200'>
        <HeaderUser />
      </header>
      <section className='h-full pb-15 pt-20'>{children}</section>
      <footer className='h-15 fixed bottom-0 left-0 w-full border-t border-t-solid border-t-gray-200'>
        <div className='h-full flex items-center justify-around'>
          {footerMenus.map((v) => (
            <MenuItem key={v.text} text={v.text} path={v.path} icon={v.icon} />
          ))}
        </div>
      </footer>
    </main>
  );
}
