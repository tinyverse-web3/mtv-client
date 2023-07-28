import { useState, useEffect, useRef, useMemo } from 'react';
import { Text, Radio } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/form/Button';
import { Input } from '@/components/form/Input';
import { ROUTE_PATH } from '@/router';
import { useGunStore } from '@/store';
import toast from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import account from '@/lib/account/account';
import { add, getUnixTime } from 'date-fns';

export default function GunRenew() {
  const nav = useNavigate();
  const gunnameRef = useRef('');
  const [gunname, setGunname] = useState('');

  const [selectedValid, setSelectedValid] = useState('0');
  const [loading, setLoading] = useState(false);
  //const { mutate: modifyuser, loading: modifyLoading };
  const { apply: applyGUN, load: loadGUN } = useGunStore((state) => state);

  const [nameValid, setnameValid] = useState('gunvalid');
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
  //const changeDisabled ;
  /*= useMemo(() => {
    console.log("changeDisabled.");
    return gunname.length < 12 || nameValid == "gunvalid";
  }, [gunname, nameValid]);
*/
  const calcValidTime = () => {
    let validTime: Date = new Date();
    console.log(selectedValid)
    switch (selectedValid) {
      case '0':
        validTime = add(new Date(), { years: 1 });
        break;
      case '1':
        validTime = add(new Date(), { years: 2 });
        break;
      case '2':
        validTime = add(new Date(), { years: 2 });
        break;
    }
    console.log('validTime = ', validTime)
    return getUnixTime(validTime);
  };
  const ApplyGun = async () => {
    console.log('ApplyGun...');
    const validTime = calcValidTime();
    setLoading(true);
    try {
      await applyGUN(gunname, validTime);
      nav(-1);
    } catch (error) {
      console.log(error)
    }
    setLoading(false);
  };


  const CheckGun = async () => {
    console.log('CheckGun...');
    // Check the gun name is used or not

    let name: string = gunname;
    if (name.length == 0) {
      name = '*';
    }

    console.log('name = ', name);
    nav(`/space/gun/search/${name}`);
  };

  const gunnameChange = (e: any) => {
    gunnameRef.current = e;
    setGunname(e);
  };

  const disabled = useMemo(() => {
    console.log(nameValid);
    console.log(gunname);
    return gunname.length < 12;
  }, [gunname, nameValid]);

  return (
    <LayoutThird showBack title='申请你的GUN域名'>
      <div className='p-6'>
        {/* <div className='pt-4 px-4'>
          <Text className='text-14px mb-4'>
            用户的全球唯一名称（Global Unique Name，GUN），可用于任何地方。例如，朋友可以通过名字找到你，这个名字也会在其他支持GUN协议的APP上显示等。
          </Text>
        </div>
        <div className='flex justify-between h-2 mb-1' >
            <span>{label}</span>
            <div className='flex items-center'>
              <div className='text-3 mr-4' style = {style}> 
                <a onClick={CheckGun}>查看GUN是否已经被申请</a>
              </div>
            </div>
        </div> */}
        <div className='flex items-center mb-4'>
          <span className='w-18 min-w-18'>名字</span>
          <Input
            id='gunnameInput'
            clearable
            bordered
            fullWidth
            maxLength={64}
            value={gunname}
            onChange={gunnameChange}
            placeholder='名字'
          />
          <Button auto flat size='xs' className='ml-4 h-10' onPress={CheckGun}>
            查找
          </Button>
        </div>
        <div className='mb-4 pl-18'>
          <Text className='text-3 text-gray-400'>
            名字不区分大小写，只能使用字母a-z和数字0-9，最少13位。
          </Text>
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
          disabled={disabled}
          loading={loading}
          className='mx-auto mb-4 w-full'
          size='lg'
          onPress={ApplyGun}>
          申请
        </Button>
      </div>
    </LayoutThird>
  );
}
