import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Avatar } from '@nextui-org/react';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { LogoutIcon } from '@/components/LogoutIcon';
import { HeaderUser } from '@/components/header/HeaderUser';
import { ROUTE_PATH } from '@/router';

const hideLogoutPath = ['/', '/restore', '/create', '/unlock'];
const MenuItem = ({ text, path, icon, className }: any) => {
  const nav = useNavigate();
  const menuClick = () => {
    path && nav(path);
  };
  return (
    <div
      className={`cursor-pointer flex flex-col h-full items-center justify-center text-3 ${
        className ? className : ''
      }`}
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

  const { pathname } = useLocation();
  const goBack = async () => {
    nav(path || -1);
  };
  const hideStatsu = useMemo(() => {
    return hideLogoutPath.includes(pathname);
  }, [pathname]);

  const footerMenus = [
    { text: '空间', path: ROUTE_PATH.SPACE_INDEX, icon: 'i-mdi-cube' },
    {
      text: '密信',
      path: ROUTE_PATH.CHAT_LIST,
      icon: 'i-mdi-message-reply-text',
    },
    {
      text: '资产',
      path: ROUTE_PATH.ASSETS_INDEX,
      icon: 'i-mdi-database-settings-outline',
    },
  ];
  return (
    <main className={'h-full relative'}>
      <header className='w-full h-20 absolute top-0 left-0 w-full border-b border-b-solid border-b-gray-200'>
        <HeaderUser />
      </header>
      <section className='h-full pb-15 pt-20'>{children}</section>
      <footer className='w-full h-15 absolute bottom-0 left-0 w-full border-t border-t-solid border-t-gray-200'>
        <div className='h-full flex items-center justify-around'>
          {footerMenus.map((v) => (
            <MenuItem
              key={v.text}
              text={v.text}
              path={v.path}
              icon={v.icon}
              className={pathname === v.path ? 'text-blue-6' : ''}
            />
          ))}
        </div>
      </footer>
    </main>
  );
}
