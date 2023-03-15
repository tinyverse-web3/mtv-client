import { Badge } from '@nextui-org/react';
import { useMemo } from 'react';
import md5 from 'md5';

import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';

const LOCAL_PASSWORD_KEY = '_keypassword';
export const PasswordWarnBadge = () => {
  const nav = useNavigate();
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const password = sessionStorage.getItem(LOCAL_PASSWORD_KEY);
  const isDefault = useMemo(() => {
    return md5(VITE_DEFAULT_PASSWORD) === password;
  }, []);
  const clickHandler = async () => {
    nav(ROUTE_PATH.CHANGE_PWD);
  };
  return isDefault ? (
    <Badge color='error' className='cursor-pointer' onClick={clickHandler}>
      请尽快修改本地默认密码
    </Badge>
  ) : (
    <></>
  );
};
