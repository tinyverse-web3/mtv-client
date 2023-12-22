import { Image, Button } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import imageSuccess from '@/assets/images/icon-success.png';
import { useAccountStore } from '@/store';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';

export default function UserPhrase() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { getLocalAccountInfo } = useAccountStore((state) => state);
  const toAccount = async () => {
    await account.saveMnemonic();
    await getLocalAccountInfo();
    nav(ROUTE_PATH.ACCOUNT);
  };
  return (
    <LayoutThird title={t('pages.account.phrase.backup')}>
      <div className='px-6 pt-10'>
        <Image src={imageSuccess} className='w-40 mb-10' />
        <Button className='w-full' size='lg' onPress={toAccount}>
          {t('common.confirm')}
        </Button>
      </div>
    </LayoutThird>
  );
}
