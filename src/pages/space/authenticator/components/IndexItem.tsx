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
  percent: number;
}
export const IndexItem = ({ Account, Code, percent }: IndexItemProps) => {
  const nav = useNavigate();
  const [code, setCode] = useState(Code);
  const [initTime, setInitTime] = useState<number>(30);
  const getCode = async () => {
    const { code, msg, data } = await account.getAuthenticatorCode({
      AccountName: Account,
    });
    if (code === '000000') {
      setCode(data);
    }
  };
  const toDetail = () => {
    nav(ROUTE_PATH.SPACE_AUTHENTICATOR_DETAIL + `?id=${Account}`);
  };
  useEffect(() => {
    if (percent === 0) {
      getCode();
    }
  }, [percent]);

  return (
    <div
      key={Account}
      className='h-16 border-b-gray-200 border-b-solid border-b flex items-center hover:bg-gray-100  px-2'>
      <div className='flex justify-between items-center w-full'>
        <div className='text-6 w-1/3' onClick={toDetail}>
          {Account}
        </div>
        <div className='w-1/3 flex items-center justify-center'>
          <span className='mr-4'>{code}</span> <CopyIcon text='code' />{' '}
        </div>
        <div className='w-1/3 flex justify-end'>
          <CircleProgress percent={percent} />
        </div>
      </div>
    </div>
  );
};
