import { Text, Avatar } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
// import { useRouter } from 'next/navigation';
import Page from '@/layout/page';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
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
  };
  const toTiny = () => {
    window.open(import.meta.env.VITE_TINY_WEB, '_blank')
  };
  return (
    <Page showBack={false} showLogo={false}>
      <div className='pt-10'>
        <div className='flex items-center justify-center mb-4'>
          <Avatar src='/logo.png' size='lg' className='ml-3' />
          <Text className='text-10 ml-4 font-600'>
            芥子空间
          </Text>
        </div>
        <Text className='text-center text-11px mb-10 text-4 leading-5'>
          我的私人超级账户<br/>进入Web3的快速通道
        </Text>
        <Button
          size='xl'
          className='m-auto mb-1'
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
          className='m-auto mb-8'
          onPress={toRestore}
          size='xl'>
          恢复账户
        </Button>
        <Button
          color='secondary'
          className='m-auto'
          onPress={toTiny}
          size='xl'>
          了解更多
        </Button>
      </div>
    </Page>
  );
}
