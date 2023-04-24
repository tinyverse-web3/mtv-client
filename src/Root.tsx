import { Outlet } from 'react-router-dom';
import { WalletCheck } from '@/components/LaunchCheck';
import { useNostrStore, useGlobalStore } from '@/store';

export default function Root() {
  const loading = useGlobalStore((state) => state.checkLoading);
  return (
    <>
      {/* all the other elements */}
      <div className='h-full'>
        <WalletCheck />
        {!loading && <Outlet />}
      </div>
    </>
  );
}
