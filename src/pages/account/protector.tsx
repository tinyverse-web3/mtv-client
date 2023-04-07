import { Button, Text, Textarea } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { QuestionMaintain } from '@/components/question/QuestionMaintain';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';

const ProtectorItem = () => {
  return (
    <div className='flex items-center h-14'>
      <text>Email</text>
      <div className='flex-1 text-end'>q****ong@tinyverse.space</div>
      <div className='i-mdi-trash-can-outline'></div>
    </div>
  );
};

export default function AccountProtector() {
  const nav = useNavigate();
  const [existed, setExisted] = useState(true);
  const [shareA, setShareA] = useState('');
  const [_, copyToClipboard] = useCopyToClipboard();
  const add = () => {
    nav(ROUTE_PATH.ACCOUNT_PROTECTOR_ADD);
  };
  const copyHandle = async () => {
    copyToClipboard(shareA);
  };
  return (
    <LayoutThird
      title='守护者'
      path={ROUTE_PATH.SPACE_INDEX}
      rightContent={
        <div onClick={add} className='i-mdi-plus-circle-outline text-5'></div>
      }>
      <div className='p-4'>
        <Text className='text-14px mb-6'>
          守护者可用于身份验证、社交恢复等。
          <br />
          请放心，我们采用零知识证明（zkp）技术，不保存任何用户隐私。
        </Text>
        <div>
          {existed ? (
            <div>
              <ProtectorItem />
              <Button
                size='lg'
                className='mx-auto mb-6 w-full'
                onPress={copyHandle}>
                备份
              </Button>
            </div>
          ) : (
            <div className='h-20 flex justify-center'>
              还未设置守护者。点击设置守护者。
            </div>
          )}
        </div>
      </div>
    </LayoutThird>
  );
}
