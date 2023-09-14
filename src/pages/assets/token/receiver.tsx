import LayoutThird from '@/layout/LayoutThird';
import { Card, CardBody } from '@nextui-org/react';
import { CopyIcon } from '@/components/CopyIcon';
import { useAccountStore } from '@/store';
import { QRCodeCanvas } from 'qrcode.react';
import { useTranslation } from 'react-i18next';

export default function Transfer() {
  const { t } = useTranslation();
  const { accountInfo } = useAccountStore((state) => state);
  return (
    <LayoutThird className='h-full' title={t('pages.assets.btn_transfer')}>
      <div className='p-4'>
        <Card>
          <CardBody>
            <div className='flex justify-center mb-6'>
              <QRCodeCanvas value={accountInfo.address} size={180} />
            </div>
            <div className='flex'>
              <div className='rounded-lg bg-gray-100 p-4 break-all flex items-center'>
                <span className='text-sm'>{accountInfo.address}</span>
                <CopyIcon text={accountInfo.address} className='ml-4' />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </LayoutThird>
  );
}
// 使用nextui实现一个转账页面，包含目标地址，转账金额的输入框，以及转账按钮
