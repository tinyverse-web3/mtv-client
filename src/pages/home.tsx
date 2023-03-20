import { Text, Button, Avatar, Row, Col } from '@nextui-org/react';
import { PasswordWarnBadge } from '../components/PasswordWarnBadge';
import { MaintainWarnBadge } from '../components/MaintainWarnBadge';
import { useWalletStore, useGlobalStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { Address } from '@/components/Address';
import { ROUTE_PATH } from '@/router';
import Page from '@/layout/page';


export default function Home() {
  const nav = useNavigate();
  const wallet = useWalletStore((state) => state.wallet);
  const userInfo = useGlobalStore((state) => state.userInfo);
  const toNote = async () => {
    nav(ROUTE_PATH.NOTE);
  };
  const toAccount = async () => {
    nav(ROUTE_PATH.ACCOUNT);
  };
  const toChat = async () => {
    nav(ROUTE_PATH.CHAT_LIST);
  };
  return (
    <Page showBack={false} title='我的芥子空间'>
      <div className='mb-4'>
        <div className='flex justify-center mb-2'>
          <PasswordWarnBadge />
          <MaintainWarnBadge />
        </div>
        <Address address={wallet?.publicKey} />
      </div>
      <Button
        iconRight={<div className='i-mdi-account' />}
        size='xl'
        className='w-full mb-4'
        onPress={toAccount}
        color='error'>
        账号维护
      </Button>
      <Button
        iconRight={<div className='i-mdi-sticker-text-outline' />}
        size='xl'
        className='w-full mb-4'
        onPress={toNote}
        color='success'>
        记事本
      </Button>
      <Button
        iconRight={<div className='i-mdi-chat' />}
        color='secondary'
        className='w-full mb-4'
        onPress={toChat}
        size='xl'>
        IM聊天
      </Button>
      <Button
        iconRight={<div className='i-mdi-chat' />}
        color='primary'
        className='w-full mb-4'
        // onPress={toChat}
        size='xl'>
        了解更多
      </Button>
    </Page>
  );
}
