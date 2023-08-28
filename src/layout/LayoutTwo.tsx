import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Avatar } from '@nextui-org/react';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { LogoutIcon } from '@/components/LogoutIcon';
import { HeaderUser } from '@/components/header/HeaderUser';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';

const hideLogoutPath = ['/', '/restore', '/create', '/unlock'];

const FooterTabs = () => {
  const { t} = useTranslation();
  const routerLocation = useLocation();
  const { pathname } = routerLocation;
  const nav = useNavigate();
  const list = [
    {
      text: t('pages.space.title'),
      path: ROUTE_PATH.SPACE_INDEX,
      icon: 'i-mdi-cube',
      value: 0,
    },
    {
      text: t('pages.chat.title'),
      path: ROUTE_PATH.CHAT_INDEX,
      icon: 'i-mdi-message-reply-text',
    },
    {
      text: t('pages.assets.title'),
      path: ROUTE_PATH.ASSETS_INDEX,
      icon: 'i-mdi-database-settings-outline',
    },
    {
      text: t('pages.account.title'),
      path: ROUTE_PATH.ACCOUNT,
      icon: 'i-mdi-card-account-details-outline',
    },
  ];
  const menuClick = (path: string) => {
    path && nav(path, { replace: true });
  };
  const active = useMemo(
    () => list.findIndex((v) => v.path === pathname),
    [pathname],
  );
  return (
    <div className='w-full rounded-6 relative h-full flex bg-gray-2 overflow-hidden'>
      {list.map(({ icon, path,text }, i) => (
        <div
          className={`w-[25%] flex flex-col justify-center items-center relative z-2 cursor-pointer ${active === i ? 'text-blue-5' : ''}`}
          key={path}
          onClick={() => menuClick(path)}>
          <div className={`${icon} w-5 h-5`}></div>
          <div className='text-12px'>{text}</div>
        </div>
      ))}
      <div
        className='w-[25%] absolute h-full bg-blue-2 rounded-6 z-1 transition duration-300'
        style={{ transform: `translateX(${100 * active}%)` }}></div>
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
  const { pathname } = useLocation();
  const hideStatsu = useMemo(() => {
    return hideLogoutPath.includes(pathname);
  }, [pathname]);

  if (!window.JsBridge) {
    // footerMenus.splice(1, 1);
  }
  return (
    <main className={'h-full relative overflow-x-hidden'}>
      {/* <header className='w-full h-24 absolute top-0 left-0 w-full border-b border-b-solid border-b-gray-200'>
        <HeaderUser key='layout-two' />
      </header> */}
      <section className='h-full overflow-y-auto pb-13'>{children}</section>
      <footer className='w-full h-13 absolute bottom-4 left-0  px-4 border-t-gray-200'>
        <FooterTabs />
      </footer>
    </main>
  );
}
