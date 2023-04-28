import { useRef, useEffect, useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { WalletCheck } from '@/components/LaunchCheck';
import { useGlobalStore, useMtvStorageStore, useWalletStore } from '@/store';
import { useRequest } from '@/api';

export default function Root() {
  const loading = useGlobalStore((state) => state.checkLoading);
  return (
    <>
      <WalletCheck />
      {!loading && <Outlet />}
    </>
  );
}
