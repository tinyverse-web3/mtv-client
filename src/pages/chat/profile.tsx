import React, { useEffect } from 'react';
import { Image, Button as NextButton } from '@nextui-org/react';
import { Input } from '@/components/form/Input';
import LayoutThird from '@/layout/LayoutThird';
import { useChatStore, useAccountStore } from '@/store';
import { toast } from 'react-hot-toast';
import account from '@/lib/account/account';

const Profile: React.FC = () => {
  const { recipient } = useChatStore((state) => state);
  const [alias, setAlias] = React.useState('');
  const changeAlias = async () => {
    const res = await account.setContactAlias({
      destPubkey: recipient?.DAuthKey,
      alias,
    });
    if (res.code === '000000') {
      toast.success('修改成功');
    } else {
      toast.error(res.msg);
    }
  };
  useEffect(() => {
    if (recipient) {
      setAlias(recipient?.Alias || '');
    }
  }, [recipient]);
  return (
    <LayoutThird className='h-full' title=''>
      <div className='p-4'>
        <div className='flex items-center mb-4'>
          <Image src='/logo.png' className='rounded w-20' />
        </div>
        <div>
          <div className='flex mb-2'>
            <span className='w-14 min-w-20'>公钥：</span>
            <span className='break-all'>{recipient?.DAuthKey}</span>
          </div>
          <div className='flex mb-2'>
            <span className='w-14 min-w-20'>消息key：</span>
            <span className='break-all'>{recipient?.MessageKey}</span>
          </div>
          <div className='flex'>
            <span className='w-14 min-w-20'>别名：</span>
            <Input value={alias} onChange={(e: string) => setAlias(e)} />
            <NextButton
              auto
              flat
              size='xs'
              className='ml-4 h-10'
              onPress={changeAlias}>
              修改
            </NextButton>
          </div>
        </div>
      </div>
    </LayoutThird>
  );
};

export default Profile;
