import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
import { RefreshLoad } from '@/components/RefreshLoad';
import { Icon } from '@iconify/react';
const hideLogoutPath = ['/', '/restore', '/create', '/unlock'];

const FooterTabs = () => {
  const { t } = useTranslation();
  const routerLocation = useLocation();
  const { pathname } = routerLocation;
  const nav = useNavigate();
  const list = [
    {
      text: t('pages.space.title'),
      path: ROUTE_PATH.SPACE_INDEX,
      icon: 'mdi:cube',
      value: 0,
    },
    {
      text: t('pages.chat.title'),
      path: ROUTE_PATH.CHAT_INDEX,
      icon: 'mdi:message-reply-text',
    },
    {
      text: t('pages.assets.title'),
      path: ROUTE_PATH.ASSETS_INDEX,
      icon: 'mdi:database-settings-outline',
    },
    {
      text: t('pages.account.title'),
      path: ROUTE_PATH.ACCOUNT,
      icon: 'mdi:card-account-details-outline',
    },
  ];
  const menuClick = (path: any) => {
    path && nav(path, { replace: true });
  };
  const active = useMemo(() => {
    return list.findIndex((v) => v.path === pathname);
  }, [pathname]);
  return (
    <div className='w-full rounded-full relative h-full flex bg-gray-200 overflow-hidden'>
      {list.map(({ icon, path, text }, i) => (
        <div
          className={`w-[25%] flex flex-col justify-center items-center relative z-20 ${
            active === i ? 'text-blue-500' : ''
          }`}
          key={path}
          onClick={() => menuClick(path)}>
          <Icon icon={icon} className='w-5 h-5' />
          <div className='text-[10px]'>{text}</div>
        </div>
      ))}
      <div
        className='w-[25%] absolute h-full bg-blue-200 rounded-full z-10 transition-transform'
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
      <section className='h-full  pb-16'>
        <div className='h-full overflow-y-auto'>{children}</div>
      </section>
      <footer className='w-full h-16 absolute bottom-0 left-0  px-4 border-t-gray-200'>
        <div className='h-14'>
          <FooterTabs />
        </div>
      </footer>
    </main>
  );
}
