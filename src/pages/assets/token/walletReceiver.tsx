import LayoutThird from '@/layout/LayoutThird';
import { Button } from '@/components/form/Button';
import { Icon } from '@iconify/react';
import { QRCodeCanvas } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import useMap from 'react-use/lib/useMap';
import { useWalletStore } from '@/store';
import { useEffect } from 'react';
import copy from 'clipboard-copy';
import toast from 'react-hot-toast';


export default function WalletReceiver() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const walletName = searchParams.get('walletName') as string;
  const walletType = searchParams.get('walletType') as string;
  const { getByName } = useWalletStore((state) => state);

  const [data, { set, setAll, remove, reset, get }] = useMap({
    Name: walletName || '',
    Type: walletType || '',
    Address: '',
  });

  const feachDetails = async () => {
    const detail = await getByName(walletName, walletType);
    console.log("feachDetails detail = " + detail);
    setAll(detail as any);
  }

  useEffect(() => {
    if (walletName) {
      feachDetails();
    }
  }, [walletName]);

  const copyHandler = async () => {
    await copy(data.Address);
    toast.success(t('pages.assets.token.address_copy_toast'));
  };
  return (
    <LayoutThird className='h-full' title={t('pages.assets.receiver.title')}>
      <div className='p-4'>
        <div className='bg-gray-100  rounded-3xl p-4 py-10  mb-4'>
          <div className='flex justify-center mb-6 '>
            <QRCodeCanvas value={data.Address} size={180} />
          </div>
          <div className=' break-all text-center '>
            <p className='mb-2 text-sm text-gray-500'>{t('pages.account.wallet_key')}</p>
            <span className='text-sm'>{data.Address}</span>
          </div>
        </div>
        <div className='bg-gray-100  rounded-3xl p-2 flex  items-center justify-between mb-2'>
          <Button
            radius='full'
            className='h-12 flex-1'>
            <Icon
              icon='mdi:share'
              className='text-2xl mr-2'
            />
            <div className='tex'>{t('common.share')}</div>
          </Button>
          <Button
            radius='full'
            className='h-12 flex-1 ml-8'
            onClick={copyHandler}>
            <Icon icon='mdi:content-copy' className='text-xl mr-2' />
            <div className=''>{t('common.copy')}</div>
          </Button>
        </div>
      </div>
    </LayoutThird>
  );
}

