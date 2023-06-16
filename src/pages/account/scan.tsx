import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { Html5Qrcode } from 'html5-qrcode';
import { QrType } from '@/type';
import { useRequest } from '@/api';
import { useAccountStore } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function UserQrcode() {
  const nav = useNavigate();
  const html5Qrcode = useRef<any>();
  const [text, setText] = useState('');
  const cameraId = useRef('');
  const { account } = useAccountStore((state) => state);

  const start = async () => {
    try {
      console.log('start');
      const constraints = { audio: false, video: { facingMode: 'user' } };
      console.log(navigator.mediaDevices.getUserMedia);
      const deviceAr = await navigator.mediaDevices.getUserMedia(constraints);
      console.log(deviceAr);
      const devices = await Html5Qrcode.getCameras();
      console.log('devices', devices);
      if (devices && devices.length) {
        cameraId.current = devices[1].id;
      } else {
        toast('没有找到摄像头');
        return;
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
    } catch (error) {
      console.log('初始化扫码错误');
      console.log(error);
    }
  };
  useEffect(() => {
    if (!html5Qrcode.current) {
      start();
    }
  }, []);
  const parseText = async () => {
    if (text) {
      const obj = JSON.parse(text);
      if (obj.type === QrType.ADD_FRIEND && obj.value) {
        await account.publishMsg(obj.value);
        toast.success('添加好友成功');
      }
    }
  };
  useEffect(() => {
    parseText();
  }, [text]);
  return (
    <LayoutThird title='我的二维码' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='pt-30'>
        <div className='r w-60 h-60 mb-20 mx-auto overflow-hidden'>
          <div id='reader'></div>
        </div>
        <div className='text-center'>扫一扫</div>
        {/* <div>扫描结果：{text}</div> */}
      </div>
    </LayoutThird>
  );
}
