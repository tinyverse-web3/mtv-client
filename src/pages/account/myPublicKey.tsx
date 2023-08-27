import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useAccountStore } from '@/store';
import { Card } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useCopyToClipboard } from 'react-use';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'react-hot-toast';
import { download } from '@/lib/utils';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';


export default function UserQrcode() {
  const { t } = useTranslation();
  const qrBoxRef = useRef<any>();
  const { accountInfo } = useAccountStore((state) => state);
  const { publicKey } = accountInfo;
  const [_, copyToClipboard] = useCopyToClipboard();
  const copy = () => {
    if (!publicKey) return;
    copyToClipboard(publicKey);
    toast.success(t('common.copy_success'));
  };
  const loadQrcode = () => {
    if (qrBoxRef.current) {
      const canvas = qrBoxRef.current.querySelector('canvas');
      const url = canvas?.toDataURL();
      console.log(url);
      if (url) {
        download(url, `qrcode_${publicKey}.png`);
      }
    }
  };

  return (
    <LayoutThird title='我的公钥'>
      <div className='pt-16 px-6'>
        {publicKey && (
          <div className='w-fit m-auto mb-16'>
            <QRCodeCanvas value={publicKey} size={200} />
          </div>
        )}
        <Card variant="bordered"  className='w-full m-auto text-12px mb-6'>
          <Card.Body className='break-all'>{publicKey}</Card.Body>
        </Card>
        <Button className='w-full mb-6 bg-cyan-5' size='lg' onPress={copy}>
          复制公钥
        </Button>
        <Button
          className='w-full mb-6 bg-blue-9'
          size='lg'
          onPress={loadQrcode}>
          保存二维码
        </Button>
      </div>
    </LayoutThird>
  );
}
