import { useState, useMemo } from 'react';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { EmailBox } from '@/components/form/EmailBox';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';

export default function Protector() {
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');


  const query = useMemo(() => {
    return {
      email,
      confirmCode: code,
    };
  }, [email, code]);


  const emailChange = ({ email, code }: any) => {
    setEmail(email);
    setCode(code);
  };
  const submit = async () => {
    setLoading(true);
    try {
      const status = await account.verifyEmail({
        account: email,
        verifyCode: code,
      });
      // if (status === STATUS_CODE.SUCCESS) {
      //   toast.success('恢复成功')
      //   nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
      // } else {
      //   toast.success('恢复失败')
      // }
      nav(ROUTE_PATH.RESTORE_PRIVATEDATA);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('恢复失败');
    }
  };
  const disabled = useMemo(() => !(email && code), [email, code]);
  return (
    <LayoutThird title='守护者恢复'>
      <div className='p-4'>
        <div>
          <div className='mb-6'>
            <EmailBox onChange={emailChange} />
          </div>
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
