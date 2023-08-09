import { useState, useEffect, useRef } from 'react';
import { Text, Radio } from '@nextui-org/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import LayoutThird from '@/layout/LayoutThird';
import { add, getUnixTime } from 'date-fns';
import { useGunStore, GunSummy } from '@/store';
import { toast } from 'react-hot-toast';
import account from '@/lib/account/account';

export default function GunRenew() {
  const nav = useNavigate();

  const [selectedValid, setSelectedValid] = useState('0');
  const { name } = useParams<{ name: string }>();
  const renewGUN = useGunStore((state) => state.renew);
  const [detail, setDetail] = useState<any>({});
  const validityList = [
    {
      value: '0',
      label: '1年',
    },
    {
      value: '1',
      label: '2年',
    },
    {
      value: '2',
      label: '3年',
    },
  ];

  const getDetail = async () => {
    if (name) {
      const { code, msg, data } = await account.getGun({
        GunName: name,
      });
      if (code === '000000') {
        const summy: GunSummy = {
          key: data.Gun_Key,
          name: data.Gun_Name,
          expired: data.ValidTime,
          owner: data.OwnerID,
        };
        setDetail(summy);
      } else {
        toast.error(msg);
      }
    }
  };
  const calcValidTime = () => {
    let validTime: Date = new Date(detail.expired);
    switch (selectedValid) {
      case '0':
        validTime = add(validTime, { years: 1 });
        break;
      case '1':
        validTime = add(validTime, { years: 2 });
        break;
      case '2':
        validTime = add(validTime, { years: 2 });
        break;
    }
    console.log('validTime = ', validTime);
    return getUnixTime(validTime);
  };
  const RenewGun = async () => {
    console.log('RenewGun...');
    const validTime = calcValidTime();
    try {
      await renewGUN(name, validTime);
      nav(-1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <LayoutThird showBack title='续期'>
      <div className='p-6'>
        <div className='flex items-center mb-4'>
          <span className='w-18 min-w-18'>名字</span>
          <span>{detail.name}</span>
        </div>
        <div className='flex mb-4'>
          <span className='w-18'>有效期</span>
          <div>
            <Radio.Group
              size='xs'
              orientation='horizontal'
              onChange={(e) => setSelectedValid(e)}
              value={selectedValid}>
              {validityList.map((v: any) => (
                <Radio key={v.value} value={v.value}>
                  {v.label}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </div>
        <div className='mb-4 pl-18'>
          <Text className='text-3 text-gray-400'>费用说明</Text>
        </div>
        <Button
          //loading={modifyLoading}
          className='mx-auto mb-4 w-full'
          size='lg'
          onPress={RenewGun}>
          续期
        </Button>
      </div>
    </LayoutThird>
  );
}
