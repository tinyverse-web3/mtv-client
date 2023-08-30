import { Badge } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useAccountStore } from '@/store';
import { useTranslation } from 'react-i18next';

export const PasswordWarnBadge = () => {
  const { accountInfo } = useAccountStore((state) => state);
  const nav = useNavigate();
  const { t } = useTranslation();
  const clickHandler = async () => {
    nav(ROUTE_PATH.ACCOUNT_CHANGE_PWD);
  };
  return !!accountInfo.isDefaultPwd ? (
    <div className='flex items-center justify-center mb-2'>
      <Badge color='error' className='cursor-pointer' onClick={clickHandler}>
        {t('common.password.change_default_hint')}
      </Badge>
    </div>
  ) : (
    <></>
  );
};
