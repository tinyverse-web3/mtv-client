import { Container } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
// import { useRouter } from 'next/navigation';
import Page from '@/layout/page';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import wallet, { STATUS_CODE } from '@/lib/wallet';
import { useWalletStore, useGlobalStore, useMtvdbStore } from '@/store';

export default function Index() {
  const [loading, setLoading] = useState(false);
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const nav = useNavigate();
  const setWallet = useWalletStore((state) => state.setWallet);
  const createMtvdb = useMtvdbStore((state) => state.create);
  const setMtvdb = useGlobalStore((state) => state.setMtvdb);
  const toRestore = () => {
    nav('/restore');
  };
  const toCreate = () => {
    create();
  };
  const create = async () => {
    setLoading(true);
    await wallet.createWallet(VITE_DEFAULT_PASSWORD);
    const { privateKey } = wallet.wallet || {};
    if (privateKey) {
      createMtvdb(privateKey).then(({ dbAddress, metadataKey }) => {
        if (dbAddress && metadataKey) {
          setMtvdb(dbAddress, metadataKey);
        }
      });
    }
    await setWallet(wallet);
    setLoading(false);
    nav('/home', { replace: true });
  };
  return (
    <Page showBack={false}>
      <div className='pt-20'>
        <Button
          size='xl'
          className='m-auto mb-6'
          onPress={toCreate}
          loading={loading}
          color='success'>
          创建
        </Button>
        <Button
          color='secondary'
          className='m-auto mb-6'
          onPress={toRestore}
          size='xl'>
          恢复
        </Button>
      </div>
    </Page>
  );
}
