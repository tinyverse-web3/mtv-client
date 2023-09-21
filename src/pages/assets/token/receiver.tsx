import LayoutThird from '@/layout/LayoutThird';
import { Card, CardBody } from '@nextui-org/react';
import { CopyIcon } from '@/components/CopyIcon';
import { Button } from '@/components/form/Button';
import { Icon } from '@iconify/react';
import { useAccountStore } from '@/store';
import { QRCodeCanvas } from 'qrcode.react';
import { useTranslation } from 'react-i18next';

export default function Receiver() {
  const { t } = useTranslation();
  const { accountInfo } = useAccountStore((state) => state);
  const copyHandler = () => {};
  return (
    <LayoutThird className='h-full' title={t('pages.assets.btn_transfer')}>
      <div className='p-4'>
        <div className='bg-gray-100  rounded-3xl p-4 py-10  mb-4'>
          <div className='flex justify-center mb-6 '>
            <QRCodeCanvas value={accountInfo.address} size={180} />
          </div>
          <div className=' break-all text-center '>
            <p className='mb-2 text-sm text-gray-500'>钱包地址</p>
            <span className='text-sm'>{accountInfo.address}</span>
          </div>
        </div>
        <div className='bg-gray-100  rounded-3xl p-2 flex  items-center justify-between mb-2'>
          <Button
            color='primary'
            radius='full'
            className='h-12 flex-1'>
            <Icon
              icon='mdi:share'
              className='text-2xl mr-2'
            />
            <div className='tex'>分享</div>
          </Button>
          <Button
            color='primary'
            radius='full'
            className='h-12 flex-1 ml-8'
            onClick={copyHandler}>
            <Icon icon='mdi:content-copy' className='text-xl mr-2' />
            <div className=''>复制</div>
          </Button>
        </div>
      </div>
    </LayoutThird>
  );
}
// 使用nextui实现一个转账页面，包含目标地址，转账金额的输入框，以及转账按钮
