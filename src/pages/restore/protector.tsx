import { useState, useMemo } from 'react';
import { Checkbox, Text, Card } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { EmailBox } from '@/components/form/EmailBox';
import { ROUTE_PATH } from '@/router';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { useNavigate } from 'react-router-dom';
import { useWalletStore, useGlobalStore, useMtvStorageStore } from '@/store';
import { useRequest } from '@/api';
import { KeySha } from '@/lib/account';
import toast from 'react-hot-toast';

export default function Protector() {
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const {
    resume: resumeMtvStorage,
    mtvStorage,
    init: initMtvStorage,
  } = useMtvStorageStore((state) => state);
  const [resumeStatus, setResumeStatus] = useState(false);
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const setWallet = useWalletStore((state) => state.setWallet);
  const { getLocalUserInfo } = useGlobalStore((state) => state);

  const query = useMemo(() => {
    return {
      email,
      confirmCode: code,
    };
  }, [email, code]);

  const restoreData = async (privateKey: string) => {
    if (privateKey) {
      if (!resumeStatus) {
        await initMtvStorage(privateKey);
      }
      await resumeMtvStorage();
      await getLocalUserInfo();
    }
  };

  const { mutate: getSssData } = useRequest({
    url: '/user/getsssdata4guardian',
    arg: {
      method: 'post',
      auth: true,
      query,
    },
  });
  const emailChange = ({ email, code }: any) => {
    setEmail(email);
    setCode(code);
  };
  const submit = async () => {
    setLoading(true);
    try {
      const data = await getSssData();
      if (data.code === '000000') {
        const { sssData, guardians } = data.data;
        const keySha = new KeySha();
        const { account } = guardians[0];
        const shareB = await keySha.get(account, '', '');
        const shares: string[] = [sssData, shareB];
        const status = await wallet.sssResotre(shares, VITE_DEFAULT_PASSWORD);
        if (status === STATUS_CODE.SUCCESS && wallet?.privateKey) {
          try {
            await restoreData(wallet?.privateKey);
            await setWallet(wallet);
            nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
          } catch (error: any) {
            if (error.toString().indexOf('resolve name') > -1) {
              toast.error('您未备份过数据，数据无法恢复！');
              nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
            } else {
              setResumeStatus(true);
              await wallet?.delete();
              toast.error('恢复数据失败，请重试！');
            }
          }
        } else if (status === STATUS_CODE.SHARES_ERROR) {
          toast.error('分片数据错误');
        }
      } else {
        toast.error(data.msg);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      await toast.error('恢复失败');
    }
  };
  const disabled = useMemo(() => !(email && code), [email, code]);
  return (
    <LayoutThird title='守护者恢复' path={ROUTE_PATH.INDEX}>
      <div className='p-4'>
        <div>
          <div className='mb-6'>
            <EmailBox onChange={emailChange} />
          </div>
          <Button
            disabled={disabled}
            size='lg'
            loading={loading}
            className='mx-auto mb-2 w-full'
            onPress={submit}>
            确定
          </Button>
        </div>
      </div>
    </LayoutThird>
  );
}
