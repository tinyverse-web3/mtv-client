import { useState, useEffect, useRef } from 'react';
import { Radio, RadioGroup } from '@nextui-org/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { add, getUnixTime } from 'date-fns';
import { useGunStore, GunSummy } from '@/store';
import { toast } from 'react-hot-toast';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';

export default function GunRenew() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [selectedValid, setSelectedValid] = useState('0');
  const { name } = useParams<{ name: string }>();
  const renewGUN = useGunStore((state) => state.renew);
  const [detail, setDetail] = useState<any>({});
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
        validTime = add(validTime, { years: 3 });
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
    <LayoutThird showBack title={t('pages.space.gun.renew')}>
      <div className='p-6'>
        <div className='flex items-center mb-4'>
          <span className='w-18 min-w-18'>
            {t('pages.space.gun.apply_name')}
          </span>
          <span>{detail.name}</span>
        </div>
        <div className='flex mb-4'>
          <span className='w-18'>{t('pages.space.gun.expired_text')}</span>
          <div>
            <RadioGroup
              size='sm'
              orientation='horizontal'
              onValueChange={(e) => setSelectedValid(e)}
              value={selectedValid}>
              {validityList.map((v: any) => (
                <Radio key={v.value} value={v.value}>
                  {v.label}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        </div>
        <div className='mb-4 pl-18'>
          <div className='text-3 text-gray-400'>
            {t('pages.space.gun.price_text')}
          </div>
        </div>
        <Button
          //loading={modifyLoading}
          className='mx-auto mb-4 w-full'
          size='lg'
          onPress={RenewGun}>
          {t('pages.space.gun.renew')}
        </Button>
      </div>
    </LayoutThird>
  );
}
