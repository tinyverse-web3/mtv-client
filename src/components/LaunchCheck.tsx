import { useEffect, useRef, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { ROUTE_HASH_PATH, routes } from '@/router/index';
import { Loading } from '@nextui-org/react';
import { Password } from '@/lib/account/wallet';
import { useIdleTimer } from 'react-idle-timer';
import { useMtvStorageStore, useWalletStore, useGlobalStore } from '@/store';
const stay_path = ['space', 'note', 'account', 'chat', 'test', 'asset'];

export const WalletCheck = () => {
  const routerLocation = useLocation();
  const { pathname } = routerLocation;
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const {
    setWallet,
    reset: resetWallet,
    wallet: storeWallet,
  } = useWalletStore((state) => state);
  const { checkLoading, setCheckLoading, userInfo } = useGlobalStore(
    (state) => state,
  );
  const {
    init: initStorage,
    mtvStorage,
    destory: destoryStorage,
  } = useMtvStorageStore((state) => state);

  useEffect(() => {
    if (userInfo?.bindStatus && mtvStorage) {
      mtvStorage?.connect();
    }
  }, [userInfo?.bindStatus, mtvStorage]);
  const launchWallet = async (wallet: any) => {
    const { privateKey } = wallet || {};
    if (privateKey && !mtvStorage) {
      try {
        console.log('init storage');
        await initStorage(privateKey);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const logout = async () => {
    const { href } = location;
    if (stay_path.some((p) => href?.indexOf(p) > -1)) {
      const password = new Password();
      await Promise.all([resetWallet()]);
      await password.remove();
      destoryStorage();
      location.replace(ROUTE_HASH_PATH.UNLOCK);
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
    if (pathname.indexOf('test') > -1) {
      setCheckLoading(false);
      return;
    }
    setCheckLoading(true);
    const status = await wallet?.check();
    if (status == STATUS_CODE.EMPTY_KEYSTORE) {
      if (pathname !== '/index') {
        console.log('pathname', pathname);
        if (pathname.indexOf('chat/imShare') > -1) {
          await wallet.create(VITE_DEFAULT_PASSWORD);
          console.log('wallet create success');
          const { privateKey } = wallet || {};
          if (privateKey) {
            await initStorage(privateKey);
          }
          await setWallet(wallet);
        } else {
          location.replace(ROUTE_HASH_PATH.INDEX);
        }
      } else {
        location.replace(ROUTE_HASH_PATH.INDEX);
      }
    } else if (
      status == STATUS_CODE.EMPTY_PASSWORD ||
      status == STATUS_CODE.INVALID_PASSWORD
    ) {
      if (!(pathname.indexOf('unlock') > -1)) {
        location.href = ROUTE_HASH_PATH.UNLOCK;
      }
    } else if (status == STATUS_CODE.SUCCESS) {
      setWallet(wallet);
      await launchWallet(wallet);
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
  useLayoutEffect(() => {
    if (
      !storeWallet &&
      !checkLoading &&
      stay_path.some((p) => pathname?.indexOf(p) > -1)
    ) {
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
      ) : null}
    </>
  );
};

export const walletLoader = async (path: string) => {
  const status = await wallet?.check();
  if (status == STATUS_CODE.EMPTY_KEYSTORE) {
    if (location.href === ROUTE_HASH_PATH.INDEX) {
      return true;
    }
  } else if (status == STATUS_CODE.EMPTY_PASSWORD) {
  } else if (status == STATUS_CODE.SUCCESS) {
    if (stay_path.some((p) => path?.indexOf(p) > -1)) {
      return true;
    }
  }
};
