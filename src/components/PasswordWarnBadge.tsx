import { Badge } from '@nextui-org/react';
import { useEffect, useMemo, useState } from 'react';
import { Password } from '@/lib/account/wallet';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';

const LOCAL_PASSWORD_KEY = '_keypassword';
export const PasswordWarnBadge = () => {
  const passwordManager = new Password();
  const nav = useNavigate();
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const [passwrod, setPwd] = useState<string | null>(null);
  const [defaultPwd, setDefaultPwd] = useState<string | undefined>();
  const password = sessionStorage.getItem(LOCAL_PASSWORD_KEY);
  const getLocalPwd = async () => {
    const localPwd = await passwordManager.get();
    const defaultEntryPwd = await passwordManager.encrypt(
      VITE_DEFAULT_PASSWORD,
    );
    setPwd(localPwd);
    setDefaultPwd(defaultEntryPwd);
  };
  const isDefault = useMemo(() => {
    return passwrod === defaultPwd;
  }, [passwrod, defaultPwd]);
  const clickHandler = async () => {
    nav(ROUTE_PATH.ACCOUNT_CHANGE_PWD);
  };
  useEffect(() => {
    getLocalPwd();
  }, []);
  return isDefault ? (
    <Badge color='error' className='cursor-pointer' onClick={clickHandler}>
      请尽快修改本地默认密码
    </Badge>
  ) : (
    <></>
  );
};
