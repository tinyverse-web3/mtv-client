import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LayoutThird from '@/layout/LayoutThird';
import { Row } from '@nextui-org/react';
import { CopyIcon } from '@/components/CopyIcon';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';

export default function Edit() {
  const nav = useNavigate();
  const [key, setKey] = useState('');

  const generateGoogleSecret = async () => {
    const { code, msg, data } = await account.generateGoogleSecret();
    if (code === '000000') {
      setKey(data);
    } else {
      toast.error(msg);
    }
  };
  useEffect(() => {
    generateGoogleSecret();
  }, []);
  return (
    <LayoutThird title='创建秘钥'>
      <div className='p-6'>
        <Row className='mb-8' justify='center' align='center'>
          <div className='mr-4'>{key}</div>
          <CopyIcon text={key} />
        </Row>
      </div>
    </LayoutThird>
  );
}
