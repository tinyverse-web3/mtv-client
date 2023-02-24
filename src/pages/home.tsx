import { Text, Button, Container, Row, Col } from '@nextui-org/react';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { useWalletStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { Address } from '@/components/Address';
import { ROUTE_PATH } from '@/router';
import { useCheckLogin } from '@/components/LoginModal';

export default function Home() {
  const nav = useNavigate();
  const wallet = useWalletStore((state) => state.wallet);
  const toNote = async () => {
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.NOTE);
    }
  };
  const toAccount = async () => {
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT);
    }
  };
  const toChat = async () => {
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.CHAT_LIST);
    }
  };
  return (
    <div className=''>
      <Row className='h-12' align='center'>
        <Col>
          <Text className='text-4'>jzy</Text>
        </Col>
        <Col className='flex justify-end'>
          <ThemeSwitch />
          {/* <Button light size='sm' auto onPress={toAccount} className='px-1.5'>
            <div className='i-material-symbols-settings'></div>
          </Button> */}
        </Col>
      </Row>
      <Row justify='center' className='mb-4'>
        <Address address={wallet?.wallet?.address} />
      </Row>
      <Button
        iconRight={<div className='i-mdi-account' />}
        size='xl'
        className='w-full mb-4'
        onPress={toAccount}
        color='success'>
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
      {/* <Button onPress={showMen}>备份助记词</Button> */}
    </div>
  );
}
