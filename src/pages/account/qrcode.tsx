import { useMemo, useRef } from 'react';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { Card, Text, Input } from '@nextui-org/react';
import { QRCodeCanvas } from 'qrcode.react';
import { useWalletStore } from '@/store';
import { download } from '@/lib/utils';
import { QrType } from '@/type';

enum MtvEnum {
  TEST,
}
export default function UserQrcode() {
  const qrBoxRef = useRef<any>();
  const { wallet } = useWalletStore((state) => state);
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
  const qrcodeValue = useMemo(() => {
    if (!wallet?.publicKey) return '';
    return JSON.stringify({
      type: QrType.ADD_FRIEND,
      value: wallet?.publicKey,
    });
  }, [wallet?.publicKey]);
  console.log(qrcodeValue);
  return (
    <LayoutThird title='我的二维码' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='pt-18'>
        <Text className='mb-24 text-center'>用于他人添加好友</Text>
        {wallet?.publicKey && (
          <div className='flex justify-center mb-12'>
            <div className=' rounded-2 overflow-hidden' ref={qrBoxRef}>
              <QRCodeCanvas value={qrcodeValue} size={160} />
            </div>
          </div>
        )}
        <div
          className='cursor-pointer text-blue-9 underline underline-solid text-center '
          onClick={loadQrcode}>
          保存图片
        </div>
      </div>
    </LayoutThird>
  );
}
