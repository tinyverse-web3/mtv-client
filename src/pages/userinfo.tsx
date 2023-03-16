import { useState, useMemo, useEffect, useRef } from 'react';
import { Row } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { ROUTE_PATH } from '@/router';
import { useGlobalStore } from '@/store';
import toast from 'react-hot-toast';
import Page from '@/layout/page';
import { useRequest } from '@/api';

export default function Userinfo() {
  const nicknameRef = useRef('');
  const [nickname, setNickname] = useState('');
  const userInfo = useGlobalStore((state) => state.userInfo);
  const setUserInfo = useGlobalStore((state) => state.setUserInfo);
  const infoChange = async () => {
    modifyuser();
  };
  const nicknameChange = (e: any) => {
    const text = e.trim().replace(/[a-z1-9_]/g, '');
    nicknameRef.current = text;
    setNickname(text);
  };
  const query = useMemo(() => ({ name: nickname }), [nickname]);
  const modifySuccess = (res: any) => {
    if (res.code === '000000') {
      toast.success('修改成功');
      setUserInfo({ nickname: nicknameRef.current });
    } else {
      toast.error(res.msg);
    }
  };
  const { mutate: modifyuser, loading: modifyLoading } = useRequest(
    {
      url: '/user/modifyuser',
      arg: {
        method: 'post',
        auth: true,
        query,
      },
    },
    {
      onSuccess: modifySuccess,
    },
  );
  const chagneDisabled = useMemo(() => {
    return !nickname || nickname === userInfo.nickname;
  }, [nickname, userInfo]);
  useEffect(() => {
    nicknameRef.current = userInfo.nickname || '';
    setNickname(userInfo.nickname || '');
  }, [userInfo]);
  return (
    <Page showBack title='个人信息' path={ROUTE_PATH.ACCOUNT}>
      <div className='pt-2'>
        <Row className='mb-12' justify='center'>
          <Input
            clearable
            bordered
            fullWidth
            maxLength={20}
            value={nicknameRef.current}
            helperText='支持英文大小写，下划线和数字'
            onChange={nicknameChange}
            rounded
            label='昵称'
          />
        </Row>
        <Button
          disabled={chagneDisabled}
          loading={modifyLoading}
          className='mx-auto'
          onPress={infoChange}>
          修改
        </Button>
      </div>
    </Page>
  );
}
