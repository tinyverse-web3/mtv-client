import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Avatar, Text } from '@nextui-org/react';
import { Address } from '@/components/Address';
import { PasswordWarnBadge } from '@/components/PasswordWarnBadge';
import { useGlobalStore, useWalletStore } from '@/store';
import { ROUTE_PATH } from '@/router';

const hideLogoutPath = ['/', '/restore', '/create', '/unlock'];

export const HeaderUser = () => {
  const nav = useNavigate();
  const userInfo = useGlobalStore((state) => state.userInfo);
  const userLevel = useGlobalStore((state) => state.userLevel);
  const { wallet } = useWalletStore((state) => state);
  // const location = useLocation();
  // const hideStatsu = useMemo(() => {
  //   return hideLogoutPath.includes(location.pathname);
  // }, [location]);
  const toUserInfo = () => {
    nav(ROUTE_PATH.ACCOUNT);
  };
  const toQrcode = () => {
    nav(ROUTE_PATH.ACCOUNT_QRCODE);
  };
  const toScan = () => {
    nav(ROUTE_PATH.ACCOUNT_SCAN);
  };
  const levelArr = [
    {
      level: 0,
      text: '临时账户，账户无法恢复，数据随时会丢失，请尽快做账户维护。',
    },
    {
      level: 1,
      text: '账户存在单点故障，请尽快做账户维护。',
    },
    {
      level: 2,
      text: '账户依赖其他账户的安全，请尽快做账户维护。',
    },
    {
      level: 3,
      text: '低标准账户，建议提示安全级别。',
    },
    {
      level: 4,
      text: '标准账户，您的账户已经很安全，但还有提升空间。',
    },
    {
      level: 5,
      text: '高标准账户，您的账户已经得到完全的保护。',
    },
  ];
  const levelText = useMemo(() => {
    return levelArr[userLevel]?.text;
  }, [userLevel]);
  return (
    <div className='h-full relative'>
      <div className='flex px-4 items-center h-full'>
        <div className='mr-4' onClick={toUserInfo}>
          <Avatar src='/logo.png' size='xl' className=' cursor-pointer' />
        </div>
        <div className='flex-1 h-full pt-6'>
          <div className='flex text-5 items-center'>
            <div className='font-600 mr-2 cursor-pointer' onClick={toUserInfo}>
              {userInfo.nickname ? (
                userInfo.nickname
              ) : (
                <Address address={wallet?.publicKey} />
              )}
            </div>
            <div
              className='i-mdi-cog-outline text-blue-9 cursor-pointer'
              onClick={toUserInfo}></div>
            <div className='i-mdi-qrcode ml-2' onClick={toQrcode}></div>
          </div>
          <div className='text-3 break-keep'>
            安全等级：
            <div className='w-4 h-4 text-center text-white bg-blue-9 rounded-full inline-block mr-1'>
              {userLevel}
            </div>
            级({levelText})
          </div>
        </div>
        <div className='i-mdi-line-scan text-7' onClick={toScan}></div>
      </div>
      <div className='absolute top-0.5 left-24'>
        <PasswordWarnBadge />
      </div>
    </div>
  );
};
