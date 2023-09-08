import { useEffect, useState } from 'react';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH, routes } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatorStore } from '@/store';
import { Button } from '@/components/form/Button';
import { Icon } from '@iconify/react'
import { IndexItem } from './components/IndexItem';
import { useTranslation } from 'react-i18next';

export default function AuthenticatorIndex() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { list, getList } = useAuthenticatorStore((state) => state);
  const [loading, setLoading] = useState(false);
  const itemClick = ({ path, url }: any) => {};
  const toAdd = () => {
    nav(ROUTE_PATH.SPACE_AUTHENTICATOR_ADD);
  };
  const toCreate = () => {
    nav(ROUTE_PATH.SPACE_AUTHENTICATOR_CREATE);
  };

  const getAuthenticatorList = async () => {
    if (!list?.length) {
      setLoading(true);
    }
    await getList();
    setLoading(false);
  };
  useEffect(() => {
    getAuthenticatorList();
  }, []);
  console.log(list);
  return (
    <LayoutThird
      title={t('pages.space.authenticator.title')}
      loading={loading}
      // rightContent={
      //   <div onClick={toAdd} className='mdi:plus-circle-outline text-5'></div>
      // }
    >
      <div className='h-full flex flex-col px-4'>
        <div className='flex-1 overscroll-y-auto'>
          {list.map((v) => (
            <IndexItem key={v.Account} Account={v.Account} Code={v.Code} />
          ))}
        </div>
        <div className='flex items-center h-18'>
          {/* <Button auto onClick={toCreate} className='flex-1'>
            创建一个秘钥
          </Button> */}
          <Button auto onClick={toAdd} className=' flex-1'>
            {t('pages.space.authenticator.btn_add')}
          </Button>
        </div>
      </div>
    </LayoutThird>
  );
}
