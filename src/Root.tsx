import { useRef, useEffect, useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { WalletCheck } from '@/components/LaunchCheck';
import { useGlobalStore, useMtvStorageStore, useWalletStore } from '@/store';
import { useRequest } from '@/api';

export default function Root() {
  const wallet = useWalletStore((state) => state.wallet);
  const signMessage = useRef<any>({});
  const loading = useGlobalStore((state) => state.checkLoading);
  const { ipns } = useMtvStorageStore((state) => state);

  const generateQuery = async () => {
    const { publicKey, address } = wallet || {};
    let sign;
    if (publicKey && address && ipns) {
      sign = await wallet?.sign(ipns);
    }
    signMessage.current = {
      publicKey: publicKey,
      address: address,
      ipns,
      sign,
    };
  };
  useLayoutEffect(() => {
    const unsub = useMtvStorageStore.subscribe((state, prev) => {
      console.log('useMtvStorageStore.subscribe');
      console.log(prev);
      console.log(state);
      if (prev.ipns !== state.ipns && state.ipns) {
        console.log('useMtvStorageStore.subscribe');
        console.log(state);
        modifyuser();
      }
    });
    return () => {
      unsub();
    }
  }, []);
  useEffect(() => {
    generateQuery();
  }, [wallet, ipns]);
  const { mutate: modifyuser } = useRequest({
    url: '/user/modifyuser',
    arg: {
      method: 'post',
      auth: true,
      query: signMessage.current,
    },
  });
  return (
    <>
      <WalletCheck />
      {!loading && <Outlet />}
    </>
  );
}
