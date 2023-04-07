import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useGlobalStore, useMtvdbStore, useNostrStore } from '@/store';
import { Card, Text, Input } from '@nextui-org/react';
import QRCode from 'react-qr-code';
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
export default function UserQrcode() {
  const html5Qrcode = useRef<any>();
  const [text, setText] = useState('');
  const cameraId = useRef('');
  const onScanSuccess = (res: any) => {
    console.log(res);
  };
  const start = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      console.log('devices', devices);

      if (devices && devices.length) {
        cameraId.current = devices[1].id;
      }
      html5Qrcode.current = new Html5Qrcode(/* element id */ 'reader');
      console.log(html5Qrcode.current);
      html5Qrcode.current
        .start(
          cameraId.current,
          {
            fps: 10, // Optional, frame per seconds for qr code scanning
            qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
          },
          async (decodedText: string) => {
            console.log(decodedText);
            setText(decodedText);
            html5Qrcode.current.pause(true);
            // do something when code is read
          },
          (errorMessage: any) => {
            // parse error, ignore it.
          },
        )
        .catch((err: any) => {
          // Start failed, handle it.
        });
    } catch (error) {}
  };
  useEffect(() => {
    if (!html5Qrcode.current) {
      start();
    }
  }, []);
  return (
    <LayoutThird title='我的二维码' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='pt-30'>
        <div className='r w-60 h-60 mb-20 mx-auto overflow-hidden'>
          <div id='reader'></div>
        </div>
        <div className='text-center'>扫一扫</div>
        <div>扫描结果：{text}</div>
      </div>
    </LayoutThird>
  );
}
