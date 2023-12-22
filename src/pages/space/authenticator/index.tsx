import { useEffect, useState, useRef, useMemo } from 'react';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH, routes,  } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatorStore } from '@/store';
import { Button } from '@/components/form/Button';
import account from '@/lib/account/account';
import { IndexItem } from './components/IndexItem';
import { useTranslation } from 'react-i18next';

export default function AuthenticatorIndex() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { list, getList } = useAuthenticatorStore((state) => state);
  const [loading, setLoading] = useState(false);
  const timer = useRef<number>(0);
  const intervalTimer = useRef<number>(0);
  // const initTime = useRef<number>(30);
  const [initTime, setInitTime] = useState<number>(30);

  const toAdd = () => {
    nav(ROUTE_PATH.SPACE_AUTHENTICATOR_ADD);
  };
  const percent = useMemo(() => {
    return ((30 - initTime) / 30) * 100;
  }, [initTime]);
  const getAuthenticatorList = async () => {
    if (!list?.length) {
      setLoading(true);
    }
    await getList();
    setLoading(false);
  };
  const getRefreshTime = async () => {
    const { code, msg, data } = await account.refreshAuthenticatorTime({
      AccountName: list[0].Account,
    });
    if (code === '000000') {
      setInitTime(data);
      // if (timer.current) {
      //   clearTimeout(timer.current);
      // }
      // timer.current = window.setTimeout(() => {
      //   getCode();
      // }, 1000 * data);
    }
  };
  useEffect(() => {
    intervalTimer.current = window.setInterval(() => {
      setInitTime((pre) => {
        if (pre === 0) {
          return 30;
        } else {
          return pre - 1;
        }
      });
    }, 1000);
    return () => {
      window.clearInterval(intervalTimer.current);
    };
  }, [list.length]);
  useEffect(() => {
    if (list.length) {
      getRefreshTime();
    }
  }, []);
  useEffect(() => {
    getAuthenticatorList();
  }, []);
  return (
    <LayoutThird
      title={t('pages.space.authenticator.title')}
      loading={loading}
    >
      <div className='h-full flex flex-col px-4'>
        <div className='flex-1 overscroll-y-auto'>
          {list.map((v) => (
            <IndexItem key={v.Account} Account={v.Account} Code={v.Code} percent={percent}/>
          ))}
        </div>
        <div className='flex items-center h-18 min-h-[4.5rem]'>
          {/* <Button auto onClick={toCreate} className='flex-1'>
            创建一个秘钥
          </Button> */}
          <Button onClick={toAdd} className=' flex-1'>
            {t('pages.space.authenticator.btn_add')}
          </Button>
        </div>
      </div>
    </LayoutThird>
  );
}
