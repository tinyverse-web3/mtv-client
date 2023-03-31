import { Text, Row, Button, Image } from '@nextui-org/react';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { useNavigate } from 'react-router-dom';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
export default function Restore() {
  const nav = useNavigate();

  const toPhrase = () => {
    nav(ROUTE_PATH.RESTORE_PHRASE);
  };
  return (
    <LayoutThird title='恢复账号'>
      <div className='pt-14 px-6'>
        <Image src='/icon-restore.png' className='mb-14 w-40' />
        <Button
          color='secondary'
          className='m-auto mb-4 w-full'
          onPress={toPhrase}
          size='xl'>
          助记词恢复
        </Button>
        <Button color='secondary' className='m-auto mb-4 w-full' size='xl'>
          社交恢复
        </Button>
        <Button color='secondary' className='m-auto mb-4 w-full' size='xl'>
          智能隐私恢复
        </Button>
      </div>
    </LayoutThird>
  );
}
