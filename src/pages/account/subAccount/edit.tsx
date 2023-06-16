import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/form/Input';
import { Select } from '@/components/form/Select';
import { v4 as uuidv4 } from 'uuid';
import LayoutThird from '@/layout/LayoutThird';
import { Row, Button } from '@nextui-org/react';
import { useAccountStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import { useMap } from 'react-use';
import { toast } from 'react-hot-toast';

export default function Edit() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  // const data = useRef<any>({
  //   name: '',
  //   key: '',
  //   type: 1,
  // });
  const [data, {set, setAll, remove, reset}] = useMap({
    name: '',
    key: '',
    type: 1,
  });
  const { account } = useAccountStore((state) => state);
  const types = [
    {
      label: 'Web3账户',
      value: '1',
    },
    {
      label: 'Web2账户',
      value: '1',
    },
    {
      label: '本地账户',
      value: '1',
    },
  ];

  const getSubAccount = async () => {
    const list = await account.getAllSubAccount();
    const item = list.find((item) => item.id === id) as any;
    if (item) {
      setAll({
        name: item.label,
        key: item.privateKey,
        type: item.type,
      });
    }
    console.log(data);
  };
  const typeChange = (e: any) => {
    data.type = e;
  };
  const nameChange = (e: any) => {
    data.name = e?.trim();
  };
  const keyChange = (e: any) => {
    data.key = e?.trim();
  };
  
  const addSubAccount = async () => {
    await account.addSubAccount({
      label: data.name,
      privateKey: data.key,
      id: uuidv4(),
      type: '3',
      remark: '',
      category: 'authenticator',
      account: '',
      service_type: '',
      publicKey: 'string',
    });
    toast.success('添加成功');
    nav(-1);
  };
  useEffect(() => {
    getSubAccount();
  }, []);
  console.log(data)
  return (
    <LayoutThird title='添加账号' path={ROUTE_PATH.ACCOUNT}>
      <div className='p-6'>
        <Row className='mb-4' justify='center'>
          <Select
            list={types}
            value={data.type}
            placeholder='账号类型'
            onChange={typeChange}></Select>
        </Row>
        {/* <Row className='mb-8' justify='center'>
          <Input
            value={name}
            maxLength={300}
            onChange={nameChange}
            placeholder='label'
          />
        </Row> */}
        <Row className='mb-8' justify='center'>
          <Input
            value={data.name}
            maxLength={300}
            onChange={nameChange}
            placeholder='账户名'
          />
        </Row>
        <Row className='mb-8' justify='center'>
          <Input
            value={data.key}
            maxLength={300}
            onChange={keyChange}
            placeholder='您的秘钥'
          />
        </Row>

        <Row className='' justify='center'>
          <Button
            color='secondary'
            className='m-auto mb-6 w-full'
            onPress={addSubAccount}
            size='md'>
            确定
          </Button>
        </Row>
      </div>
    </LayoutThird>
  );
}
