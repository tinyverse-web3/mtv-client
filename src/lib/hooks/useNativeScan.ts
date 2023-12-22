import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { QrType } from '@/type';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';

export const useNativeScan = () => {
  const { t } = useTranslation();

  const [result, setResult] = useState('');
  const nativeScan = async (result: any) => {
    if (result.data) {
      const searchParams = new URLSearchParams(result.data);
      const type = searchParams.get('type') as any;
      const value = searchParams.get('value');
      if (Number(type) === QrType.ADD_FRIEND && value) {
        await account.createContactByMasterKey(value);
        toast.success(t('pages.chat.search.success'));
      } else if (type === 'url' && value) {
        location.href = value;
      } else {
        setResult(result.data);
      }
    }
  };
  const start = () => {
    if (window.JsBridge) {
      console.log('native scan');
      window.JsBridge.startQrcodeScanActivity(nativeScan);
    }
  };
  return { start, result };
};
