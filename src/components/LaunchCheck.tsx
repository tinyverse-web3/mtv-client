import { useLayoutEffect, useEffect, useState } from 'react';
// import { useNavigate, redirect, useLocation } from 'react-router-dom';
import wallet, { STATUS_CODE } from '@/lib/wallet';
import { ROUTE_PATH } from '@/router/index';
import { Loading } from '@nextui-org/react';
import { useMtvdbStore, useNoteStore, useWalletStore } from '@/store';

const stay_path = ['home', 'note', 'account', 'chat', 'test'];
//一个简单的鉴权操作
export const WalletCheck = () => {
  // const nav = useNavigate();
  const setWallet = useWalletStore((state) => state.setWallet);
  const initDb = useMtvdbStore((state) => state.init);
  const mtvDb = useMtvdbStore((state) => state.mtvDb);
  const initNote = useNoteStore((state) => state.init);
  const [loading, setLoadng] = useState(false);
  const launchWallet = async (wallet: any) => {
    const { privateKey } = wallet?.wallet || {};
    if (privateKey) {
      await initDb(privateKey)
      console.log(mtvDb?.kvdb);
      if (mtvDb?.kvdb) {
        try {
          
          const localNote = await mtvDb?.get('note');
          const list = JSON.parse(localNote);
          if (list) {
            await initNote(list)
          }
        } catch (error) {
          
        }
        
      }
    }
  };
  const checkStatus = async () => {
    // setLoadng(true);
    const status = await wallet?.check();
    // setLoadng(false);
    console.log(wallet);
    if (status == STATUS_CODE.EMPTY_KEYSTORE) {
      const { pathname } = location;
      if (pathname !== '/') {
        location.replace(ROUTE_PATH.INDEX);
      }
    } else if (status == STATUS_CODE.EMPTY_PASSWORD) {
      const { pathname } = location;
      if (!(pathname.indexOf('unlock') > -1)) {
        location.replace(ROUTE_PATH.UNLOCK);
      }
    } else if (status == STATUS_CODE.SUCCESS) {
      // redirect('/home');
      const { pathname } = location;
      setWallet(wallet);
      await launchWallet(wallet);
      if (!stay_path.some((p) => pathname?.indexOf(p) > -1)) {
        location.replace(ROUTE_PATH.HOME);
      }
    }
  };
  useEffect(() => {
    checkStatus();
  }, []);
  useEffect(() => {
  }, [wallet]);
  return (
    <>
      {loading ? (
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
    } else {
      // return redirect('/');
    }
  } else if (status == STATUS_CODE.EMPTY_PASSWORD) {
    // return redirect('/unlock');
  } else if (status == STATUS_CODE.SUCCESS) {
    if (stay_path.some((p) => path?.indexOf(p) > -1)) {
      return true;
    }
    // return redirect('/home');
  }
};
