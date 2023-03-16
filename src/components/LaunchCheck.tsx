import { useLayoutEffect, useEffect, useState } from 'react';
// import { useNavigate, redirect, useLocation } from 'react-router-dom';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { ROUTE_PATH } from '@/router/index';
import { Loading } from '@nextui-org/react';

import {
  useMtvdbStore,
  useNoteStore,
  useWalletStore,
  useGlobalStore,
} from '@/store';
const stay_path = ['home', 'note', 'account', 'chat', 'test', 'changePwd'];
//一个简单的鉴权操作
export const WalletCheck = () => {
  // const nav = useNavigate();
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const setWallet = useWalletStore((state) => state.setWallet);
  const user = useGlobalStore((state) => state.userInfo);
  const checkLoading = useGlobalStore((state) => state.checkLoading);
  const createMtvdb = useMtvdbStore((state) => state.create);
  const setMtvdb = useGlobalStore((state) => state.setMtvdb);
  const mtvdbInfo = useGlobalStore((state) => state.mtvdbInfo);
  const setCheckLoading = useGlobalStore((state) => state.setCheckLoading);
  const initDb = useMtvdbStore((state) => state.init);

  const launchWallet = async (wallet: any) => {
    const { publicKey, privateKey } = wallet || {};
    if (privateKey && mtvdbInfo?.dbAddress) {
      try {
        console.log('initdb');
        initDb(privateKey, mtvdbInfo?.dbAddress, mtvdbInfo?.metadataKey);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const checkStatus = async () => {
    const { pathname } = location;
    if (pathname.indexOf('test') > -1) {
      setCheckLoading(false);
      return;
    }
    setCheckLoading(true);
    const status = await wallet?.check();
    if (status == STATUS_CODE.EMPTY_KEYSTORE) {
      if (pathname !== '/') {
        if (pathname.indexOf('chat') > -1) {
          await wallet.create(VITE_DEFAULT_PASSWORD);
          console.log('wallet create success');
          const { publicKey, privateKey } = wallet || {};
          if (privateKey) {
            await createMtvdb(privateKey).then(({ dbAddress, metadataKey }) => {
              console.log('mtvdb create success');
              if (dbAddress && metadataKey) {
                setMtvdb(dbAddress, metadataKey);
              }
            });
          }
          await setWallet(wallet);
        } else {
          location.replace(ROUTE_PATH.INDEX);
        }
      }
    } else if (status == STATUS_CODE.EMPTY_PASSWORD || status == STATUS_CODE.INVALID_PASSWORD ) {
      if (!(pathname.indexOf('unlock') > -1)) {
        location.replace(ROUTE_PATH.UNLOCK);
      }
    } else if (status == STATUS_CODE.SUCCESS) {
      setWallet(wallet);
      await launchWallet(wallet);
      if (!stay_path.some((p) => pathname?.indexOf(p) > -1)) {
        location.replace(ROUTE_PATH.HOME);
      }
    }
    setCheckLoading(false);
  };
  useEffect(() => {
    checkStatus();
  }, []);
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
  console.log(status);
  if (status == STATUS_CODE.EMPTY_KEYSTORE) {
    if (location.pathname === ROUTE_PATH.INDEX) {
      return true;
    }
  } else if (status == STATUS_CODE.EMPTY_PASSWORD) {
  } else if (status == STATUS_CODE.SUCCESS) {
    if (stay_path.some((p) => path?.indexOf(p) > -1)) {
      return true;
    }
  }
};
