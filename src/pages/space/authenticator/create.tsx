import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/form/Input';
import { Select } from '@/components/form/Select';
import LayoutThird from '@/layout/LayoutThird';
import { Text, Container, Row, Button } from '@nextui-org/react';
import { ROUTE_PATH } from '@/router';
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
    <LayoutThird title='添加账号'>
      <div className='p-6'>
        <Row className='mb-8' justify='center'>
          <div>{key}</div>
        </Row>
      </div>
    </LayoutThird>
  );
}
