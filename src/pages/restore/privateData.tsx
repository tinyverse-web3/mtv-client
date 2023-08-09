import { useState } from 'react';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import { useNavigate } from 'react-router-dom';
import { useKeyPressEvent } from 'react-use';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { toast } from 'react-hot-toast';
import account from '@/lib/account/account';
import { useAccountStore, useGlobalStore } from '@/store';

export default function Unlock() {
  const nav = useNavigate();
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);
  const { getLocalAccountInfo } = useAccountStore((state) => state);
  const { setLockStatus } = useGlobalStore((state) => state);
  const add = async () => {
    setLoading(true);
    const privateArr = [text, password, customText];
    const privateFilter = privateArr.filter((v) => !!v);
    if (privateFilter.length < 2) {
      toast.error('请至少输入两种内容');
      setLoading(false);
      return;
    }
    try {
      const { code, msg } = await account.restoreByGuardian({
        textPrivateData: text,
        passwordPrivateData: password,
      });
      if (code === '000000') {
        await getLocalAccountInfo();
        setLockStatus(false);
        nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
        toast.success('恢复成功');
      } else {
        toast.error(msg);
      }
    } catch (error) {
      toast.error('恢复失败');
    }
    setLoading(false);
  };
  const pressHandler = async () => {
    await add();
  };
  useKeyPressEvent('Enter', () => {
    if (text) {
      pressHandler();
    }
  });
  const onChange = (e: any) => {
    setText(e?.trim());
  };
  const onPasswordChange = (e: any) => {
    setPassword(e?.trim());
  };
  const onCustomChange = (e: any) => {
    setCustomText(e?.trim());
  };
  return (
    <LayoutThird title='恢复加密保险箱'>
      <div className='pt-8 px-6'>
        <div className='text-center mb-8'>请先恢复加密保险箱，在恢复账号</div>
        <Input
          clearable
          bordered
          fullWidth
          maxLength={20}
          value={text}
          className='h-50px mb-6'
          onChange={onChange}
          placeholder='身份证/社会保险号码/手机号码'
          initialValue=''
        />
        <Input
          clearable
          bordered
          fullWidth
          maxLength={20}
          value={password}
          className='h-50px mb-6'
          onChange={onPasswordChange}
          placeholder='常用口令'
          initialValue=''
        />
        <Input
          clearable
          bordered
          fullWidth
          maxLength={20}
          value={customText}
          className='h-50px mb-6'
          onChange={onCustomChange}
          placeholder='自定义特征数据'
          initialValue=''
        />
        <Button
          disabled={true}
          size='lg'
          loading={loading}
          className='mx-auto mb-6 w-full'
          onPress={add}>
          指纹
        </Button>
        <Button
          disabled={!text && !password && !customText}
          size='lg'
          loading={loading}
          className='mx-auto w-full'
          onPress={add}>
          确认
        </Button>
      </div>
    </LayoutThird>
  );
}
