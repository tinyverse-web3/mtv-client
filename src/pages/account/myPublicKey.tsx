import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useWalletStore } from '@/store';
import { Card } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useCopyToClipboard } from 'react-use';
import QRCode from 'react-qr-code';
import { toast } from 'react-hot-toast';

export default function UserQrcode() {
  const { wallet } = useWalletStore((state) => state);
  const [_, copyToClipboard] = useCopyToClipboard();
  const copy = () => {
    if (!wallet?.publicKey) return;
    copyToClipboard(wallet?.publicKey);
    toast.success('复制成功');
  };
  return (
    <LayoutThird title='我的公钥' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='pt-16 px-6'>
        {wallet?.publicKey && (
          <Card className='w-50 m-auto mb-16'>
            <Card.Body>
              <QRCode
                size={256}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                value={wallet?.publicKey}
                viewBox={`0 0 256 256`}
              />
            </Card.Body>
          </Card>
        )}
        <Card className='w-full m-auto text-12px mb-6'>
          <Card.Body>{wallet?.publicKey}</Card.Body>
        </Card>
        <Button className='w-full mb-6' size='lg' onPress={copy}>
          复制公钥
        </Button>
        <Button className='w-full mb-6' size='lg'>
          保存二维码
        </Button>
      </div>
    </LayoutThird>
  );
}
