import { useMemo, useRef } from 'react';
import LayoutThird from '@/layout/LayoutThird';
import { QRCodeCanvas } from 'qrcode.react';
import { useAccountStore } from '@/store';
import { download } from '@/lib/utils';
import { QrType } from '@/type';
import { useTranslation } from 'react-i18next';

enum MtvEnum {
  TEST,
}
export default function UserQrcode() {
  const { t } = useTranslation();
  const qrBoxRef = useRef<any>();
  const { accountInfo } = useAccountStore((state) => state);
  const { publicKey } = accountInfo;
  const loadQrcode = () => {
    if (qrBoxRef.current) {
      const canvas = qrBoxRef.current.querySelector('canvas');
      const url = canvas?.toDataURL();
      if (url) {
        download(url, `qrcode_${publicKey}.png`);
      }
    }
  };
  const qrcodeValue = useMemo(() => {
    if (!publicKey) return '';
    return `type=${QrType.ADD_FRIEND}&value=${publicKey}`
  }, [publicKey]);
  return (
    <LayoutThird title='我的二维码'>
      <div className='pt-18'>
        <div className='mb-24 text-center'>用于他人添加好友</div>
        {publicKey && (
          <div className='flex justify-center mb-12'>
            <div className=' rounded-2 overflow-hidden' ref={qrBoxRef}>
              <QRCodeCanvas value={qrcodeValue} size={160} />
            </div>
          </div>
        )}
        <div
          className=' text-blue-9 underline underline-solid text-center '
          onClick={loadQrcode}>
          保存图片
        </div>
      </div>
    </LayoutThird>
  );
}
