import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/form/Input';
import { Textarea } from '@/components/form/Textarea';
import { Select } from '@/components/form/Select';
import { v4 as uuidv4 } from 'uuid';
import LayoutThird from '@/layout/LayoutThird';
import {  Button } from '@nextui-org/react';
import { useMap } from 'react-use';
import { toast } from 'react-hot-toast';
import account from '@/lib/account/account';

export default function Edit() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  // const data = useRef<any>({
  //   name: '',
  //   key: '',
  //   type: 1,
  // });
  const [data, { set, setAll, remove, reset }] = useMap({
    name: '',
    key: '',
    mnemonic: '',
    type: 'web3',
  });
  const types = [
    {
      label: 'Web3账户',
      value: 'web3',
    },
    {
      label: 'Web2账户',
      value: 'web2',
    },
    {
      label: '本地账户',
      value: 'local',
    },
  ];

  const getSubAccount = async () => {
    // const list = await account.getAllSubAccount();
    // const item = list.find((item) => item.id === id) as any;
    // if (item) {
    //   setAll({
    //     name: item.label,
    //     key: item.privateKey,
    //     mnemonic: item.mnemonic,
    //     type: item.type,
    //   });
    // }
    // console.log(data);
  };
  const typeChange = (e: any) => {
    set('type', e);
  };
  const nameChange = (e: any) => {
    set('name', e);
  };
  const keyChange = (e: any) => {
    set('key', e);
  };

  const addSubAccount = async () => {
    // await account.addSubAccount({
    //   id: uuidv4(),
    //   type: 'web3',
    //   label: data.name,
    //   remark: '',
    //   category: '',
    //   address: data.name,
    //   publicKey: '',
    //   privateKey: '',
    //   mnemonic: data.mnemonic,
    // });
    toast.success('添加成功');
    nav(-1);
  };
  useEffect(() => {
    getSubAccount();
  }, []);
  console.log(data);
  return (
    <LayoutThird title='添加账号'>
      <div className='p-6'>
        <div className='mb-4'>
          <Select
            list={types}
            value={data.type}
            placeholder='账号类型'
            onChange={typeChange}></Select>
        </div>
        <div className='mb-8'>
          <Input
            value={data.name}
            maxLength={300}
            onChange={nameChange}
            placeholder='账户名'
          />
        </div>
        <div className='mb-8'>
          {/* <Input
            value={data.key}
            maxLength={300}
            onChange={keyChange}
            placeholder='您的秘钥'
          /> */}
          {data.type === 'web3' && (
            <Textarea
              value={data.mnemonic}
              maxLength={300}
              onChange={keyChange}
              placeholder='您的助记词'
            />
          )}
        </div>

        <div className=''>
          <Button
            className='m-auto mb-6 w-full'
            onPress={addSubAccount}
            size='md'>
            确定
          </Button>
        </div>
      </div>
    </LayoutThird>
  );
}
