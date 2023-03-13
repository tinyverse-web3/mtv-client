import { useState, useMemo } from 'react';
import { Text, Row, Button } from '@nextui-org/react';
import { Input } from '@/components/form/Input';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import {
  useWalletStore,
  useMtvdbStore,
  useGlobalStore,
  useNostrStore,
} from '@/store';
import Page from '@/layout/page';

export default function Userinfo() {
  const [nickname, setNickname] = useState('');
  const wallet = useWalletStore((state) => state.wallet);
  const infoChange = async () => {};
  const nicknameChange = (e: any) => {
    const text = e.trim().replace(/[^\w_]/g, '');
    setNickname(text);
  };
  return (
    <Page showBack title='个人信息' path={ROUTE_PATH.ACCOUNT}>
      <div className='pt-6'>
        <Row className='mb-12' justify='center'>
          <Input
            clearable
            bordered
            fullWidth
            maxLength={20}
            value={nickname}
            helperText='英文大小写，下划线和数字'
            onChange={nicknameChange}
            rounded
            labelPlaceholder='昵称'
            initialValue=''
          />
        </Row>
        <Button disabled={!nickname} className='mx-auto' onPress={infoChange}>
          修改
        </Button>
      </div>
    </Page>
  );
}
