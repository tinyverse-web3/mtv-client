import { useState, useMemo } from 'react';
import { Checkbox, Text, Card } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { EmailBox } from '@/components/form/EmailBox';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
export default function AccountQuestion() {
  const nav = useNavigate();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const emailChange = ({ email, code }: any) => {
    setEmail(email);
    setCode(code);
  };
  const checkboxChange = (e: boolean) => {
    setChecked(e);
  };
  const submit = () => {
    // setChecked(e);
    nav(-1);
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
