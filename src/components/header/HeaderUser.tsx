import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Avatar, Text } from '@nextui-org/react';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { LogoutIcon } from '@/components/LogoutIcon';
import { useGlobalStore } from '@/store';
import { ROUTE_PATH } from '@/router';

const hideLogoutPath = ['/', '/restore', '/create', '/unlock'];

export const HeaderUser = () => {
  const nav = useNavigate();
  const userInfo = useGlobalStore((state) => state.userInfo);
  const location = useLocation();
  const hideStatsu = useMemo(() => {
    return hideLogoutPath.includes(location.pathname);
  }, [location]);
  const toUserInfo = () => {
    nav(ROUTE_PATH.ACCOUNT);
  };
  const toQrcode = () => {
    nav(ROUTE_PATH.ACCOUNT_QRCODE);
  };
  return (
    <div className='flex px-4 items-center h-full'>
      <div className='mr-4' onClick={toUserInfo}>
        <Avatar src='/logo.png' size='lg' />
      </div>
      <div className='flex-1'>
        <div className='flex text-5 items-center'>
          <Text className='font-600'>青龙 </Text>
          <div className='i-mdi-qrcode ml-2' onClick={toQrcode}></div>
        </div>
        <div className='text-3'>安全等级：1级</div>
      </div>
      <div>扫码</div>
    </div>
  );
};
