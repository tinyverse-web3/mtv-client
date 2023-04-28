import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useWalletStore } from '@/store';
import { Card } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useCopyToClipboard } from 'react-use';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'react-hot-toast';
import { download } from '@/lib/utils';
import { useRef } from 'react';

export default function UserQrcode() {
  const qrBoxRef = useRef<any>();
  const { wallet } = useWalletStore((state) => state);
  const [_, copyToClipboard] = useCopyToClipboard();
  const copy = () => {
    if (!wallet?.publicKey) return;
    copyToClipboard(wallet?.publicKey);
    toast.success('复制成功');
  };
  const loadQrcode = () => {
    if (qrBoxRef.current) {
      const canvas = qrBoxRef.current.querySelector('canvas');
      const url = canvas?.toDataURL();
      console.log(url);
      if (url) {
        download(url, `qrcode_${wallet?.publicKey}.png`);
      }
    }
  };

  return (
    <LayoutThird title='我的公钥' path={ROUTE_PATH.ACCOUNT}>
      <div className='pt-16 px-6'>
        {wallet?.publicKey && (
          <Card className='w-fit m-auto mb-16'>
            <Card.Body ref={qrBoxRef}>
              <QRCodeCanvas
                value={wallet?.publicKey}
                size={200}
              />
            </Card.Body>
          </Card>
        )}
        <Card className='w-full m-auto text-12px mb-6'>
          <Card.Body>{wallet?.publicKey}</Card.Body>
        </Card>
        <Button className='w-full mb-6 bg-cyan-5' size='lg' onPress={copy}>
          复制公钥
        </Button>
        <Button className='w-full mb-6 bg-blue-9' size='lg' onPress={loadQrcode}>
          保存二维码
        </Button>
      </div>
    </LayoutThird>
  );
}
