import { useEffect, useRef, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { STATUS_CODE } from '@/lib/account/account';
import { ROUTE_HASH_PATH, routes } from '@/router/index';
import { Loading } from '@nextui-org/react';
import { Password } from '@/lib/account/wallet';
import { useIdleTimer } from 'react-idle-timer';
import { Outlet } from 'react-router-dom';
import { useAccountStore, useGlobalStore } from '@/store';
const stay_path = ['space', 'note', 'account', 'chat', 'test', 'asset'];

export const WalletCheck = ({ children }: any) => {
  const routerLocation = useLocation();
  const { pathname } = routerLocation;
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const { checkLoading, setCheckLoading } = useGlobalStore((state) => state);
  const { account } = useAccountStore((state) => state);

  const logout = async () => {
    const { href } = location;
    if (stay_path.some((p) => href?.indexOf(p) > -1)) {
      await account.lock();
      location.reload();
    }
  };
  const onIdle = () => {
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
    if (status == STATUS_CODE.EMPTY_KEYSTORE) {
      if (pathname !== '/index') {
        if (pathname.indexOf('chat/imShare') > -1) {
          await account.create(VITE_DEFAULT_PASSWORD);
        } else {
          location.replace(ROUTE_HASH_PATH.INDEX);
        }
      } else {
        location.replace(ROUTE_HASH_PATH.INDEX);
      }
    } else if (status == STATUS_CODE.INVALID_PASSWORD) {
      if (!(pathname.indexOf('unlock') > -1)) {
        location.href = ROUTE_HASH_PATH.UNLOCK;
      }
    } else if (status == STATUS_CODE.SUCCESS) {
      if (!stay_path.some((p) => pathname?.indexOf(p) > -1)) {
        location.replace(ROUTE_HASH_PATH.SPACE_INDEX);
      }
    }
    setCheckLoading(false);
  };
  useEffect(() => {
    if (checkLoading) {
      checkStatus();
    }
  }, []);
  useEffect(() => {
    if (!checkLoading && stay_path.some((p) => pathname?.indexOf(p) > -1)) {
      console.log('router change');
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
