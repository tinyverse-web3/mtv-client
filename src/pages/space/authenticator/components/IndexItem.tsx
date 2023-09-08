import { useEffect, useState, useMemo, useRef } from 'react';
import account from '@/lib/account/account';
import { CopyIcon } from '@/components/CopyIcon';
import { useTimeout } from 'react-use';
import { CircleProgress } from './CircleProgress';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
interface IndexItemProps {
  Account: string;
  Code: string;
}
export const IndexItem = ({ Account, Code }: IndexItemProps) => {
  const nav = useNavigate();
  const [code, setCode] = useState(Code);
  const timer = useRef<number>(0);
  const intervalTimer = useRef<number>(0);
  // const initTime = useRef<number>(30);
  const [initTime, setInitTime] = useState<number>(30);
  const getCode = async () => {
    const { code, msg, data } = await account.getAuthenticatorCode({
      AccountName: Account,
    });
    if (code === '000000') {
      setCode(data);
    }
  };
  const getRefreshTime = async () => {
    const { code, msg, data } = await account.refreshAuthenticatorTime({
      AccountName: Account,
    });
    if (code === '000000') {
      setInitTime(data);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = window.setTimeout(() => {
        getCode();
      }, 1000 * data);
    }
  };
  const percent = useMemo(() => {
    return ((30 - initTime) / 30) * 100;
  }, [initTime]);
  const toDetail = () => {
    nav(ROUTE_PATH.SPACE_AUTHENTICATOR_DETAIL + `?id=${Account}`);
  };
  useEffect(() => {
    window.clearInterval(intervalTimer.current);
  }, []);
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
  }, [Account]);
  useEffect(() => {
    if (initTime === 0) {
      getCode();
    }
  }, [initTime]);

  useEffect(() => {
    getRefreshTime();
  }, []);
  return (
    <div
      key={Account}
      className='h-18 border-b-gray-200 border-b-solid border-b flex items-center hover:bg-gray-100  px-2'>
      <div className='flex justify-between items-center w-full'>
        <div className='text-6 w-20' onClick={toDetail}>
          {Account}
        </div>
        <div className='flex items-center'>
          <span className='mr-4'>{code}</span> <CopyIcon text='code' />{' '}
        </div>
        <CircleProgress percent={percent} />
      </div>
    </div>
  );
};
