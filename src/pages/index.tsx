import { Text, Link } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
// import { useRouter } from 'next/navigation';
import LayoutOne from '@/layout/LayoutOne';
import { HeaderLogo } from '@/components/header/HeaderLogo';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import wallet from '@/lib/account/wallet';
import { useWalletStore, useMtvStorageStore } from '@/store';
import { ROUTE_PATH } from '@/router';

export default function Index() {
  const [loading, setLoading] = useState(false);
  const { VITE_DEFAULT_PASSWORD, VITE_TINY_WEB } = import.meta.env;
  const nav = useNavigate();
  const setWallet = useWalletStore((state) => state.setWallet);
  const initMtvStorage = useMtvStorageStore((state) => state.init);
  const toRestore = () => {
    nav('/restore');
  };
  const toCreate = () => {
    create();
  };
  const create = async () => {
    setLoading(true);
    console.time('create wallet');
    await wallet.create(VITE_DEFAULT_PASSWORD);
    const { privateKey } = wallet || {};
    if (privateKey) {
      await initMtvStorage(privateKey);
    }
    await setWallet(wallet);
    setLoading(false);
    console.timeEnd('create wallet');
    nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
  };
  return (
    <LayoutOne>
      <div className='pt-16 px-6'>
        <HeaderLogo />
        <Button
          size='xl'
          className='m-auto mb-2 w-full bg-blue-4'
          onPress={toCreate}
          loading={loading}>
          一键创建
        </Button>
        <Text className='text-13px mb-4'>
          使用默认密码创建，创建之后请及时修改
        </Text>
        <Button
          color='secondary'
          className='m-auto mb-4 w-full h-50px bg-blue-6'
          onPress={toRestore}
          size='xl'>
          恢复账号
        </Button>
        <div className='flex justify-end'>
          <Link href={VITE_TINY_WEB} target='_blank' className='text-blue-9'>
            了解更多
          </Link>
        </div>
        <div className='text-3 text-center mt-20'>
          测试数据库已于2023年5月27日清除，旧账号无法通过守护者和智能隐私恢复。
        </div>
      </div>
    </LayoutOne>
  );
}
