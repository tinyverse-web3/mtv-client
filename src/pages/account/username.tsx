import { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { useNavigate } from 'react-router-dom';
import { useAccountStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';

export default function Userinfo() {
  const nicknameRef = useRef('');
  const nav = useNavigate();
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const timer = useRef<any>();
  const { accountInfo, setAccountInfo } = useAccountStore((state) => state);
  const infoChange = async () => {
    nav(ROUTE_PATH.SPACE_GUN_LIST);
  };
  const nicknameChange = (e: any) => {
    nicknameRef.current = e;
    setNickname(e);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      const text = e.trim().replace(/[^A-Za-z0-9_]/g, '');
      nicknameRef.current = text;
      setNickname(text);
    }, 100);
  };

  const chagneDisabled = useMemo(() => {
    return !nickname || nickname === accountInfo.name;
  }, [nickname, accountInfo]);
  useEffect(() => {
    if (accountInfo.name) {
      setNickname(accountInfo.name);
    }
  }, [accountInfo]);
  return (
    <LayoutThird showBack title='修改名字'>
      <div className='pt-4 px-4'>
        <div className='text-14px mb-6'>
          用户的全球唯一名称（Global Unique
          Name，GUN），可用于任何地方。例如，朋友可以通过名字找到你，这个名字也会在其他支持GUN协议的APP上显示等。
        </div>
        <div className='mb-6'>
          {nickname ? (
            <Input
              clearable
              bordered
              fullWidth
              readOnly
              maxLength={20}
              value={nickname}
              onChange={nicknameChange}
              placeholder='名字'
            />
          ) : (
            <div className='text-center text-4'>暂无名称快去GUN申请一个吧</div>
          )}
        </div>
        <Button
          loading={loading}
          className='mx-auto mb-2 w-full'
          size='lg'
          onPress={infoChange}>
          去GUN申请或修改
        </Button>
      </div>
    </LayoutThird>
  );
}
