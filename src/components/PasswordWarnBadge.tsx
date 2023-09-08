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
    <div className='flex justify-center items-center mb-1'>
      <div className='py-1 px-3 text-white text-xs rounded-full bg-red-500' onClick={clickHandler}>
        {t('common.password.change_default_hint')}
      </div>
    </div>
  ) : (
    <></>
  );
};
