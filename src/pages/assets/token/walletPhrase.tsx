import {
  Card,
  CardBody,
} from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function WalletPhrase() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const walletName = searchParams.get('walletName') as string;
  const walletType = searchParams.get('walletType') as string;

  const toVerify = () => {
    nav(ROUTE_PATH.ASSETS_TOKEN_WALLET_PHRASE_VERIFY + '?walletName=' + walletName + '&walletType=' + walletType);
  };
  const [mnemonic, setMnemonic] = useState<string>('');
  const getMnemonic = async () => {
    let result: any = {};
    if (walletType === 'Bitcoin') {
      result = await account.getBtcWalletMnemonic(walletName);
    } else if (walletType === 'Ethereum') {
      result = await account.getEthWalletMnemonic(walletName);
    }
    
    if (result.code !== '000000') {
      toast.error(result.msg);
      return
    }
    const _mnemonic = result.data;
    setMnemonic(_mnemonic);
  };

 
  useEffect(() => {
    getMnemonic();
  }, []);
  return (
    <LayoutThird title={t('pages.account.phrase.backup')}>
      <div className='p-4'>
          <>
            <div className='text-4 mb-4'>
              {t('pages.assets.token.backup_phrase_hint')}
            </div>
            <Card className='mb-4'>
              <CardBody>
                <div>{mnemonic}</div>
              </CardBody>
            </Card>
            <Button onClick={toVerify} className='w-full' size='lg'>
              {t('common.next_step')}
            </Button>
          </>
      </div>
    </LayoutThird>
  );
}
