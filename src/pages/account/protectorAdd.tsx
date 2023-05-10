import { useState, useMemo } from 'react';
import { Checkbox, Text, Card } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { EmailBox } from '@/components/form/EmailBox';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '@/api';
import toast from 'react-hot-toast';
import { useGlobalStore } from '@/store';
export default function ProtectorAdd() {
  const nav = useNavigate();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const { changeProtectorStatus } = useGlobalStore((state) => state);
  const { mutate } = useRequest(
    {
      url: '/guardian/add',
      arg: {
        auth: true,
        method: 'post',
        query: { account: email, verifyCode: code, type: 'email' },
      },
    },
    {
      onError() {
        setLoading(false);
      },
    },
  );

  const emailChange = ({ email, code }: any) => {
    setEmail(email);
    setCode(code);
  };
  const checkboxChange = (e: boolean) => {
    setChecked(e);
  };
  const submit = async () => {
    // setChecked(e);
    try {
      await mutate();
      await toast.success('添加成功');
      await changeProtectorStatus(true);
      nav(ROUTE_PATH.ACCOUNT_PROTECTOR);
    } catch (error) {
      await toast.error('添加失败');
    }
  };
  const disabled = useMemo(
    () => !(checked && email && code),
    [checked, email, code],
  );
  return (
    <LayoutThird title='添加守护者' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='p-4'>
        <Text className='text-14px mb-6'>
          守护者可用于身份验证、社交恢复等。
          <br />
          请放心，我们采用零知识证明（zkp）技术，不保存任何用户隐私。
        </Text>
        <div>
          <div className='mb-6'>
            <EmailBox onChange={emailChange} />
          </div>
          <Checkbox
            className='mb-3'
            aria-label='checkbox'
            // isSelected={checked}
            onChange={checkboxChange}>
            <Text className='text-3'>
              我已阅读并同意《隐私政策》及《用户服务协议》
            </Text>
          </Checkbox>
          <Button
            disabled={disabled}
            size='lg'
            loading={loading}
            className='mx-auto mb-2 w-full'
            onPress={submit}>
            确定
          </Button>
        </div>
      </div>
    </LayoutThird>
  );
}
