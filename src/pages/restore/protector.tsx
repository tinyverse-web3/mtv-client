import { useState, useMemo } from 'react';
import { Checkbox, Text, Card } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { EmailBox } from '@/components/form/EmailBox';
import { ROUTE_PATH } from '@/router';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { useNavigate } from 'react-router-dom';
import { useWalletStore, useGlobalStore, useMtvdbStore } from '@/store';
import { useRequest } from '@/api';
import { KeySha } from '@/lib/account';
import toast from 'react-hot-toast';

export default function AccountQuestion() {
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const initMtvdb = useMtvdbStore((state) => state.init);
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const setWallet = useWalletStore((state) => state.setWallet);
  const { setBindStatus, setUserLevel, setUserInfo, setMtvdb } = useGlobalStore((state) => state);

  const query = useMemo(() => {
    return {
      email,
      confirmCode: code,
    };
  }, [email, code]);
  const { mutate: getuserinfo } = useRequest(
    {
      url: '/user/getuserinfo',
      arg: { method: 'get', auth: true },
    },
    {
      onSuccess: async (res) => {
        const { email, dbAddress, ipns, name, safeLevel } = res.data;
        if (email) {
          setBindStatus(true);
        }
        setUserLevel(safeLevel);
        setUserInfo({ email, nickname: name });
        setMtvdb(dbAddress, ipns);

        const { privateKey } = wallet || {};
        if (privateKey && dbAddress && ipns) {
          await initMtvdb(privateKey, dbAddress, ipns);
        }
        setLoading(true);    
        nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
      },
      onError() {
        setLoading(false);
      }
    },
  );
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
      console.log(data);
      if (data.code === '000000') {
        const { sssData, guardians } = data.data;
        const keySha = new KeySha();
        const { account } = guardians[1];
        console.log(account);
        const shareB = await keySha.get(account, '', '');
        console.log(shareB);
        const shares: string[] = [sssData, shareB];
        const status = await wallet.sssResotre(shares, VITE_DEFAULT_PASSWORD);
        console.log(status);
        if (status === STATUS_CODE.SUCCESS) {
          await setWallet(wallet);
          await getuserinfo();
        } else if (status === STATUS_CODE.SHARES_ERROR) {
          toast.error('分片数据错误');
        }
        setLoading(false);
        await toast.success('恢复成功');
      } else {
        await toast.error(data.msg);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      await toast.error('恢复失败');
    }
  };
  const disabled = useMemo(() => !(email && code), [email, code]);
  return (
    <LayoutThird title='添加守护者' path={ROUTE_PATH.SPACE_INDEX}>
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
