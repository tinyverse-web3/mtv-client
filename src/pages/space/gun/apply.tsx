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
import { useTranslation } from 'react-i18next';

export default function GunRenew() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const timer = useRef<any>(null);
  const [selectedValid, setSelectedValid] = useState('0');
  const [loading, setLoading] = useState(false);
  //const { mutate: modifyuser, loading: modifyLoading };
  const {
    apply: applyGUN,
    load: loadGUN,
    searchName,
    setName,
  } = useGunStore((state) => state);

  const [nameValid, setnameValid] = useState('gunvalid');
  const validityList = [
    {
      value: '0',
      label: t('pages.space.gun.one_year'),
    },
    {
      value: '1',
      label: t('pages.space.gun.two_year'),
    },
    {
      value: '2',
      label: t('pages.space.gun.three_year'),
    },
  ];
  //const changeDisabled ;
  /*= useMemo(() => {
    console.log("changeDisabled.");
    return searchName.length < 12 || nameValid == "gunvalid";
  }, [searchName, nameValid]);
*/
  const calcValidTime = () => {
    let validTime: Date = new Date();
    console.log(selectedValid);
    switch (selectedValid) {
      case '0':
        validTime = add(new Date(), { years: 1 });
        break;
      case '1':
        validTime = add(new Date(), { years: 2 });
        break;
      case '2':
        validTime = add(new Date(), { years: 3 });
        break;
    }
    console.log('validTime = ', validTime);
    return getUnixTime(validTime);
  };
  const ApplyGun = async () => {
    console.log('ApplyGun...');
    const validTime = calcValidTime();
    setLoading(true);
    try {
      await applyGUN(searchName, validTime);
      nav(-1);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const CheckGun = async () => {
    console.log('CheckGun...');
    // Check the gun name is used or not

    let name: string = searchName;
    if (name.length == 0) {
      name = '*';
    }

    console.log('name = ', name);
    nav(`/space/gun/search/${name}`);
  };

  const searchNameChange = (e: any) => {
    setName(e);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      const text = e.trim().replace(/[^A-Za-z0-9_]/g, '');
      setName(text);
    }, 100);
  };
  const calcPoint = useMemo(() => {
    const len = searchName.length;
    const pointMap: any = {
      8: '10006 TVS',
      9: '1006 TVS',
      10: '106 TVS',
      11: '16 TVS',
    };
    if (len <= 7) {
      return pointMap[7];
    } else if (len >= 11) {
      return pointMap[11];
    } else {
      return pointMap[len];
    }
  }, [searchName]);
  const disabled = useMemo(() => {
    console.log(nameValid);
    console.log(searchName);
    return searchName.length < 8;
  }, [searchName, nameValid]);

  return (
    <LayoutThird showBack title={t('pages.space.gun.apply_title')}>
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
        <div className='mb-2'>
          <div className='w-18 min-w-18 mb-2'>
            {t('pages.space.gun.apply_name')}
          </div>
          <div className='flex items-center'>
            <Input
              id='searchNameInput'
              clearable
              bordered
              fullWidth
              maxLength={64}
              value={searchName}
              onChange={searchNameChange}
              placeholder={t('pages.space.gun.apply_name')}
            />
            <Button
              auto
              flat
              size='xs'
              className='ml-4 h-10'
              onPress={CheckGun}>
              {t('pages.space.gun.search')}
            </Button>
          </div>
        </div>
        <div className='mb-4'>
          <Text className='text-3 text-gray-400'>
            {t('pages.space.gun.rule_text')}
          </Text>
        </div>
        <div className='mb-4'>
          <div className='mb-2'>{t('pages.space.gun.expired_text')}</div>
          <div>
            <Radio.Group
              size='xs'
              orientation='horizontal'
              onChange={(e) => setSelectedValid(e)}
              value={selectedValid}>
              {validityList.map((v: any, i: number) => (
                <Radio key={v.value} value={v.value} isDisabled={i > 0}>
                  {v.label}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </div>
        <div className='mb-4 flex items-center text-[14px]'>
          <Text className=' text-gray-400'>
            <span>{t('pages.space.gun.price_text')}：</span>
          </Text>
          {searchName.length > 0 && (
            <Text className='text-blue-5 ml-4'>
              {searchName.length < 8 ? (
                <span>{t('pages.space.gun.price_soon')}</span>
              ) : (
                <span>
                  {t('pages.space.gun.price_hint')}
                  {calcPoint}
                </span>
              )}
            </Text>
          )}
        </div>
        <Button
          disabled={disabled}
          loading={loading}
          className='mx-auto mb-4 w-full'
          size='lg'
          onPress={ApplyGun}>
          {t('pages.space.gun.apply')}
        </Button>
      </div>
    </LayoutThird>
  );
}
