import { useState, useMemo, useEffect, useRef } from 'react';
import { Text } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { ROUTE_PATH } from '@/router';
import { useGlobalStore } from '@/store';
import toast from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import { useRequest } from '@/api';

export default function Userinfo() {
  const nicknameRef = useRef('');
  const [nickname, setNickname] = useState('');
  const timer = useRef<any>();
  const userInfo = useGlobalStore((state) => state.userInfo);
  const setUserInfo = useGlobalStore((state) => state.setUserInfo);
  const infoChange = async () => {
    modifyuser();
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
  const modifySuccess = (res: any) => {
    if (res.code === '000000') {
      toast.success('修改成功');
      setUserInfo({ nickname: nicknameRef.current.toLocaleLowerCase() });
    } else {
      toast.error(res.msg);
    }
  };
  const { mutate: modifyuser, loading: modifyLoading } = useRequest(
    {
      url: '/user/updatename',
      arg: {
        method: 'post',
        auth: true,
        query: {
          name: nickname.toLocaleLowerCase(),
        },
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
    <LayoutThird showBack title='修改名字' path={ROUTE_PATH.ACCOUNT}>
      <div className='pt-4 px-4'>
        <Text className='text-14px mb-6'>
          用户的全球唯一名称（Global Unique
          Name，GUN），可用于任何地方。例如，朋友可以通过名字找到你，这个名字也会在其他支持GUN协议的APP上显示等。
        </Text>
        <div className='mb-6'>
          <Input
            clearable
            bordered
            fullWidth
            maxLength={20}
            value={nickname}
            onChange={nicknameChange}
            placeholder='名字'
          />
        </div>
        <Button
          disabled={chagneDisabled}
          loading={modifyLoading}
          className='mx-auto mb-2 w-full'
          size='lg'
          onPress={infoChange}>
          修改
        </Button>
        <Text className='text-3 mb-4'>
          目前只支持字母、数字和连接符_，且不区分字母大小写。仅可免费修改一次。
        </Text>
      </div>
    </LayoutThird>
  );
}
