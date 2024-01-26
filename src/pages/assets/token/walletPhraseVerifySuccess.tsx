import { Image, Button } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate, useSearchParams } from 'react-router-dom';
import imageSuccess from '@/assets/images/icon-success.png';
import { useAccountStore } from '@/store';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';

export default function WalletPhraseVerifySuccess() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const walletName = searchParams.get('walletName') as string;
  const walletType = searchParams.get('walletType') as string;
  const toDetails = async () => {
    nav(ROUTE_PATH.ASSETS_TOKEN_WALLET_DETAILS + `?name=${walletName}` + `&type=${walletType}`);
  };
  return (
    <LayoutThird title={t('pages.account.phrase.backup')}>
      <div className='flex flex-col items-center px-6 pt-10'>
        <Image src={imageSuccess} className='w-40 mb-10' />
        <Button className='w-full' size='lg' onPress={toDetails}>
          {t('common.confirm')}
        </Button>
      </div>
    </LayoutThird>
  );
}
