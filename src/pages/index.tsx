import { Text, Link } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
// import { useRouter } from 'next/navigation';
import LayoutOne from '@/layout/LayoutOne';
import { HeaderLogo } from '@/components/header/HeaderLogo';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import wallet from '@/lib/account/wallet';
import { useWalletStore, useGlobalStore, useMtvdbStore } from '@/store';

export default function Index() {
  const [loading, setLoading] = useState(false);
  const { VITE_DEFAULT_PASSWORD, VITE_TINY_WEB } = import.meta.env;
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
    await wallet.create(VITE_DEFAULT_PASSWORD);
    const { publicKey, privateKey } = wallet || {};
    if (privateKey) {
      await createMtvdb(privateKey).then(({ dbAddress, metadataKey }) => {
        if (dbAddress && metadataKey) {
          setMtvdb(dbAddress, metadataKey);
        }
      });
    }
    await setWallet(wallet);
    setLoading(false);
    nav('/home', { replace: true });
  }
  return (
    <LayoutOne>
      <div className='pt-10 px-8'>
        <HeaderLogo />
        <Button
          size='xl'
          className='m-auto mb-1 w-full'
          onPress={toCreate}
          loading={loading}
          color='success'>
          一键创建
        </Button>
        <Text className='text-center text-11px mb-4'>
          使用默认密码创建，创建之后请及时修改
        </Text>
        <Button
          color='secondary'
          className='m-auto mb-4 w-full'
          onPress={toRestore}
          size='xl'>
          恢复账户
        </Button>
        <div className='flex justify-end'>
          <Link href={VITE_TINY_WEB} target="_blank">了解更多</Link>
        </div>
      </div>
    </LayoutOne>
  );
}
