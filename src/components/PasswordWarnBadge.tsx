import { Badge } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useAccountStore } from '@/store'

export const PasswordWarnBadge = () => {
  const { accountInfo } = useAccountStore((state) => state);
  const nav = useNavigate();

  const clickHandler = async () => {
    nav(ROUTE_PATH.ACCOUNT_CHANGE_PWD);
  };
  return accountInfo.isDefaultPwd ? (
    <Badge color='error' className='cursor-pointer' onClick={clickHandler}>
      请尽快修改本地默认密码
    </Badge>
  ) : (
    <></>
  );
};
