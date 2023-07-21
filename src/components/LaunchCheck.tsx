import { useEffect, useRef, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ROUTE_HASH_PATH, routes } from '@/router/index';
import { Loading } from '@nextui-org/react';
import account from '@/lib/account/account';
import { useIdleTimer } from 'react-idle-timer';
import { Outlet } from 'react-router-dom';
import { useAccountStore, useGlobalStore } from '@/store';
const stay_path = ['space', 'note', 'account', 'chat', 'test', 'asset'];

export const WalletCheck = ({ children }: any) => {
  const routerLocation = useLocation();
  const { pathname } = routerLocation;
  const { checkLoading, setCheckLoading, lockStatus, setLockStatus, reset: resetGlobal } =
    useGlobalStore((state) => state);
  const { getLocalAccountInfo } = useAccountStore((state) => state);

  const logout = async () => {
    const { href } = location;
    if (stay_path.some((p) => href?.indexOf(p) > -1)) {
      await account.lock();
      await resetGlobal();
      setLockStatus(true);
      location.href = `${
        ROUTE_HASH_PATH.UNLOCK
      }?redirect=${encodeURIComponent(location.href)}`;
    }
  };
  const onIdle = () => {
    if (['unlock', 'retrieve'].some((p) => pathname?.indexOf(p) > -1)) {
      return;
    }
    console.log(`window idle, user is level`);
    logout();
  };

  useIdleTimer({
    onIdle,
    timeout: 60 * 10 * 1000,
    throttle: 2000,
  });
  const checkStatus = async () => {
    if (pathname.indexOf('test') > -1 || pathname.indexOf('app') > -1) {
      setCheckLoading(false);
      return;
    }
    // setCheckLoading(true);
    const status = await account.checkStatus();
    const [accountStatus, passwordStatus] = await Promise.all([
      account.hasLocalAccount(),
      account.hasPassword(),
    ]);
    console.log('accountStatus', accountStatus);
    console.log('passwordStatus', passwordStatus);
    if (!accountStatus) {
      if (pathname !== '/index') {
        if (pathname.indexOf('chat/imShare') > -1) {
          await account.create();
        } else {
          location.replace(ROUTE_HASH_PATH.INDEX);
        }
      } else {
        location.replace(ROUTE_HASH_PATH.INDEX);
      }
    } else if (!passwordStatus) {
      if (!(pathname.indexOf('unlock') > -1)) {
        location.href = `${
          ROUTE_HASH_PATH.UNLOCK
        }?redirect=${encodeURIComponent(location.href)}`;
      }
    } else {
      setLockStatus(false);
      getLocalAccountInfo();
      if (!stay_path.some((p) => pathname?.indexOf(p) > -1)) {
        location.replace(ROUTE_HASH_PATH.SPACE_INDEX);
      }
    }
    setCheckLoading(false);
  };
  useEffect(() => {
    checkStatus();
  }, []);
  useEffect(() => {
    if (
      !checkLoading &&
      stay_path.some((p) => pathname?.indexOf(p) > -1) &&
      lockStatus
    ) {
      console.log('router change check');
      checkStatus();
    }
  }, [routerLocation]);
  return (
    <>
      {checkLoading ? (
        <div className='w-full h-screen absolute top-0 left-0 flex justify-center items-center z-10'>
          <Loading />
        </div>
      ) : (
        <>
          <Outlet />
        </>
      )}
    </>
  );
};
