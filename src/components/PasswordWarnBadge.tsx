import { Badge } from '@nextui-org/react';
import { useMemo } from 'react';
import md5 from 'md5';

const LOCAL_PASSWORD_KEY = '_keypassword';
export const PasswordWarnBadge = () => {
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const password = sessionStorage.getItem(LOCAL_PASSWORD_KEY);
  const isDefault = useMemo(() => {
    return md5(VITE_DEFAULT_PASSWORD) === password;
  }, []);
  return isDefault ? <Badge color='error'>请尽快修改默认密码</Badge> : <></>;
};
