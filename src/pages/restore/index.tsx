import { Text, Row, Image } from '@nextui-org/react';
import {Button } from '@/components/form/Button';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { useNavigate } from 'react-router-dom';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
export default function Restore() {
  const nav = useNavigate();

  const toPhrase = () => {
    nav(ROUTE_PATH.RESTORE_PHRASE);
  };
  const toProtector = () => {
    nav(ROUTE_PATH.RESTORE_PROTECTOR);
  };
  const toQuestionVerify = () => {
    nav(ROUTE_PATH.RESTORE_VERIFY);
  };
  return (
    <LayoutThird title='恢复账号'>
      <div className='pt-7 px-6'>
        <Image src='/icon-restore.png' className='mb-12 w-40' />
        <Button
          className='m-auto mb-4 w-full bg-cyan-700'
          onPress={toPhrase}
          size='xl'>
          助记词恢复
        </Button>
        <Button className='m-auto mb-4 w-full bg-blue-8' size='xl' onPress={toProtector}>
          守护者恢复
        </Button>
        <Button className='m-auto mb-4 w-full bg-blue-9' size='xl'  onPress={toQuestionVerify}>
          智能隐私恢复
        </Button>
      </div>
    </LayoutThird>
  );
}
