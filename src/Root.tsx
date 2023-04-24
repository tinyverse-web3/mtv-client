import { Outlet } from 'react-router-dom';
import { WalletCheck } from '@/components/LaunchCheck';
import { useGlobalStore } from '@/store';

export default function Root() {
  const loading = useGlobalStore((state) => state.checkLoading);
  return (
    <>
      <WalletCheck />
      {!loading && <Outlet />}
    </>
  );
}
