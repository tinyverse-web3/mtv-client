import { useLayoutEffect, useEffect, useState } from 'react';
import { resolvePath, matchRoutes } from 'react-router-dom';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { ROUTE_HASH_PATH, routes } from '@/router/index';
import { Loading } from '@nextui-org/react';

import {
  useMtvdbStore,
  useNoteStore,
  useWalletStore,
  useGlobalStore,
} from '@/store';
const stay_path = ['space', 'note', 'account', 'chat', 'test', 'changePwd'];
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
    console.log(Location);
    const { href } = location;
    if (href.indexOf('test') > -1) {
      setCheckLoading(false);
      return;
    }
    console.log(resolvePath(ROUTE_HASH_PATH.ACCOUNT))
    setCheckLoading(true);
    const status = await wallet?.check();
    if (status == STATUS_CODE.EMPTY_KEYSTORE) {
      if (href !== '/') {
        if (href.indexOf('chat') > -1) {
          await wallet.create(VITE_DEFAULT_PASSWORD);
          console.log('wallet create success');
          const { publicKey, privateKey } = wallet || {};
          console.log(privateKey)
          if (privateKey) {
            createMtvdb(privateKey).then(({ dbAddress, metadataKey }) => {
              console.log('mtvdb create success');
              if (dbAddress && metadataKey) {
                setMtvdb(dbAddress, metadataKey);
              }
            });
          }
          await setWallet(wallet);
        } else {
          location.replace(ROUTE_HASH_PATH.INDEX);
        }
      }
    } else if (
      status == STATUS_CODE.EMPTY_PASSWORD ||
      status == STATUS_CODE.INVALID_PASSWORD
    ) {
      if (!(href.indexOf('unlock') > -1)) {
        location.replace(ROUTE_HASH_PATH.UNLOCK);
      }
    } else if (status == STATUS_CODE.SUCCESS) {
      setWallet(wallet);
      await launchWallet(wallet);
      console.log(href?.indexOf('account'))
      if (!stay_path.some((p) => href?.indexOf(p) > -1)) {
        // location.replace(ROUTE_HASH_PATH.SPACE_INDEX);
      }
    }
    setCheckLoading(false);
  };
  useEffect(() => {
    // setCheckLoading(false);
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
