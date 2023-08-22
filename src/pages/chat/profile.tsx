import React, { useEffect, useState } from 'react';
import { Image, Button as NextButton } from '@nextui-org/react';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { useChatStore, useAccountStore } from '@/store';
import { toast } from 'react-hot-toast';
import account from '@/lib/account/account';
import { useNavigate } from 'react-router-dom';
import { DelConfirmModel } from '@/components/DelConfirmModel';

const Profile: React.FC = () => {
  const nav = useNavigate();
  const { recipient } = useChatStore((state) => state);
  const [alias, setAlias] = React.useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [delItem, setDelItem] = useState('');
  const changeAlias = async () => {
    const res = await account.setContactAlias({
      destPubkey: recipient?.DAuthKey,
      alias,
    });
    if (res.code === '000000') {
      toast.success('修改成功');
      nav(-1);
    } else {
      toast.error(res.msg);
    }
  };
  const showDelModal = async () => {
    setShowStatus(true);
  };

  const removeItem = async () => {
    if (recipient?.MessageKey) {
      const { code, msg } = await account.delContact(recipient.MessageKey);
      if (code === '000000') {
        toast.success('删除成功');
        nav(-2);
      } else {
        toast.error(msg || '删除失败');
      }
    }
  };
  const delConfirm = async () => {
    await removeItem();
  };
  const onClose = async () => {
    setShowStatus(false);
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
          <div className='flex mb-4'>
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
          <div>
            <Button className='w-full mb-2'>清楚历史消息</Button>
            <Button className='w-full mb-2' onPress={showDelModal}>
              删除联系人
            </Button>
          </div>
        </div>
      </div>
      <DelConfirmModel
        text='联系人'
        show={showStatus}
        onConfirm={delConfirm}
        onClose={onClose}
      />
    </LayoutThird>
  );
};

export default Profile;
