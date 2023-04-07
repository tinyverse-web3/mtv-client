import { Image, Button } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import imageSuccess from '@/assets/images/icon-success.png';

export default function UserPhrase() {
  const nav = useNavigate();
  const toAccount = () => {
    nav(ROUTE_PATH.ACCOUNT);
  };
  return (
    <LayoutThird title='守护者备份' path={ROUTE_PATH.ACCOUNT}>
      <div className='px-6 pt-10'>
        <Image src={imageSuccess} className='w-40 mb-10' />
        <Button className='w-full' size='lg' onPress={toAccount}>
          完成
        </Button>
      </div>
    </LayoutThird>
  );
}
