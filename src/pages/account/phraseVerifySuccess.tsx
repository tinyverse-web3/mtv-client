import { Image, Button } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import imageSuccess from '@/assets/images/icon-success.png';
import { useGlobalStore } from '@/store';

export default function UserPhrase() {
  const nav = useNavigate();
  const { setUserInfo } = useGlobalStore((state) => state);
  // useUpdateLevel();
  const toAccount = async () => {
    await setUserInfo({ maintainPhrase: true });
    nav(ROUTE_PATH.ACCOUNT);
  };
  return (
    <LayoutThird title='助记词备份' path={ROUTE_PATH.ACCOUNT_PHRASE_VERIFY}>
      <div className='px-6 pt-10'>
        <Image src={imageSuccess} className='w-40 mb-10' />
        <Button className='w-full' size='lg' onPress={toAccount}>
          完成
        </Button>
      </div>
    </LayoutThird>
  );
}
