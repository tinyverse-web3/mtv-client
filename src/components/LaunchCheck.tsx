import { useEffect, useRef, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';
import { ROUTE_HASH_PATH, routes } from '@/router/index';
import account from '@/lib/account/account';
import { useIdleTimer } from 'react-idle-timer';
import { Outlet } from 'react-router-dom';
import { useAccountStore, useGlobalStore } from '@/store';
const stay_path = ['home', 'space', 'note', 'account', 'chat', 'test', 'asset', 'restore'];

export const LaunchCheck = ({ children }: any) => {
  const routerLocation = useLocation();

  const {
    checkLoading,
    setCheckLoading,
    lockStatus,
    loading,
    setLoading,
    setLockStatus,
    reset: resetGlobal,
  } = useGlobalStore((state) => state);
  const { getLocalAccountInfo } = useAccountStore((state) => state);

  const logout = async () => {
    await account.lock();
    await resetGlobal();
    setLockStatus(true);
    location.href = `${ROUTE_HASH_PATH.UNLOCK}?redirect=${encodeURIComponent(
      location.href,
    )}`;
  };
  const onIdle = () => {
    const { pathname } = routerLocation;
    console.log(`window idle, user is level ${pathname}`);
    if (stay_path.some((p) => pathname?.indexOf(p) > -1)) {
      logout();
    }
  };

  useIdleTimer({
    onIdle,
    timeout: 10 * 1000 * 60,
    throttle: 2000,
  });
  const checkStatus = async () => {
    const { pathname } = routerLocation;
    console.log('pathname', pathname);
    if (pathname.indexOf('test') > -1 || pathname.indexOf('app') > -1) {
      setCheckLoading(false);
      return;
    }
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
    } else if (accountStatus && !passwordStatus) {
      console.log(pathname);
      console.log(pathname.indexOf('unlock') < 0);
      if (location.href.indexOf('unlock') < 0) {
        const _href = location.href;
        console.log('location.href', _href);
        location.replace(
          `${ROUTE_HASH_PATH.UNLOCK}?redirect=${encodeURIComponent(_href)}`,
        );
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
  // useEffect(() => {
  //   const { pathname } = routerLocation;
  //   if (
  //     !checkLoading &&
  //     stay_path.some((p) => pathname?.indexOf(p) > -1) &&
  //     lockStatus
  //   ) {
  //     console.log('router change check');
  //     checkStatus();
  //   }
  //   setLoading(false);
  // }, [routerLocation]);
  return (
    <>
      {checkLoading ? (
        <div className='w-full h-screen absolute top-0 left-0 flex justify-center items-center z-10'>
          {/* <Loading /> */}
        </div>
      ) : (
        <div className='h-full relative'>
          <Outlet />
          {loading && (
            <div className='absolute z-10000 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
              <Spinner color='blue.500' size='lg' />
            </div>
          )}
        </div>
      )}
    </>
  );
};
