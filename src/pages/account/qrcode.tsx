import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useGlobalStore, useMtvdbStore, useNostrStore } from '@/store';
import { Card, Text, Input } from '@nextui-org/react';
import QRCode from 'react-qr-code';

export default function UserQrcode() {
  return (
    <LayoutThird title='我的二维码' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='pt-20'>
        <Text className='mb-20 text-center'>Create and connect your world on web3</Text>
        <Card className='w-60 m-auto'>
          <Card.Body>
            <QRCode
              size={256}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={window.location.origin + '/chat/imShare?pk='}
              viewBox={`0 0 256 256`}
            />
          </Card.Body>
        </Card>
      </div>
    </LayoutThird>
  );
}
