import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { Html5Qrcode } from 'html5-qrcode';
import { QrType } from '@/type';
import { useRequest } from '@/api';
import { useAccountStore } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMount } from 'react-use';
import { useNavigate } from 'react-router-dom';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';

export default function UserScan() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const html5Qrcode = useRef<any>();
  const [text, setText] = useState('');
  const cameraId = useRef('');
  const nativeScan = (result: any) => {
    console.log(result);
    // console.log(typeof result);
    setText(result.data);
    if (!result.data) {
      nav(-1);
    }
    // alert(JSON.stringify(result));
  };
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
        const backCamer = devices.find((item: any) => item.label.indexOf('back') > -1);
        cameraId.current = backCamer?.id || devices[0].id
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
            // html5Qrcode.current.pause(true);
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
      console.log(t('common.init_scan_error'));
      console.log(error);
    }
  };
  useMount(() => {
    if (window.JsBridge) {
      console.log('native scan');
      window.JsBridge.startQrcodeScanActivity(nativeScan);
    } else if (!html5Qrcode.current) {
      start();
    }
  });
  const parseText = async () => {
    if (text) {
      const searchParams = new URLSearchParams(text);
      const type = searchParams.get('type') as any;
      const value = searchParams.get('value');
      if (Number(type) === QrType.ADD_FRIEND && value) {
        await account.createContactByMasterKey(value);
        toast.success(t('pages.chat.search.success'));
      } else {
        toast.success(t('common.no_result'));
      }
      nav(-1);
    }
  };
  useEffect(() => {
    parseText();
  }, [text]);
  return (
    <LayoutThird title={t('common.scan')}>
      <div className='pt-30'>
        <div className='r w-60 h-60 mb-20 mx-auto overflow-hidden'>
          <div id='reader'></div>
        </div>
        <div className='text-center'>{t('common.scan')}</div>
        {/* <div>扫描结果：{text}</div> */}
      </div>
    </LayoutThird>
  );
}
