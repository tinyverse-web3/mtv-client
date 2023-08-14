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
  const [name, setName] = useState('');
  const [key, setKey] = useState('');

  const types = [
    {
      label: '基于时间',
      value: 1,
    },
    {
      label: '基于计数器',
      value: 2,
    },
  ];
  const nameChange = (e: any) => {
    setName(e?.trim());
  };
  const keyChange = (e: any) => {
    setKey(e?.trim());
  };

  const add = async () => {
    const { code, msg } = await account.addAuthenticator({
      Account: name,
      Secret: key,
    });
    if (code === '000000') {
      toast.success('添加成功');
    } else {
      toast.error(msg);
    }
  };
  return (
    <LayoutThird title='添加账号'>
      <div className='p-6'>
        <Row className='mb-8' justify='center'>
          <Input
            value={name}
            maxLength={300}
            onChange={nameChange}
            placeholder='账户名'
          />
        </Row>
        <Row className='mb-8' justify='center'>
          <Input
            value={key}
            maxLength={300}
            onChange={keyChange}
            placeholder='您的秘钥'
          />
        </Row>
        <Row className='mb-8' justify='center'>
          <Select list={types} placeholder='秘钥类型'></Select>
        </Row>
        <Row className='' justify='center'>
          <Button
            color='secondary'
            disabled={!name}
            className='m-auto mb-6'
            onPress={add}
            size='md'>
            确定
          </Button>
        </Row>
      </div>
    </LayoutThird>
  );
}
