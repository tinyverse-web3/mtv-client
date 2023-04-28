import { useState } from 'react';
import { Text, Row, Textarea } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { useNavigate } from 'react-router-dom';
import { useWalletStore, useMtvStorageStore, useGlobalStore } from '@/store';
import toast from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useRequest } from '@/api';

export default function Phrase() {
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const nav = useNavigate();
  const [phrase, setPhrase] = useState('');
  const [loading, setLoading] = useState(false);
  const { setBindStatus, setUserLevel, setUserInfo } = useGlobalStore((state) => state);
  const setWallet = useWalletStore((state) => state.setWallet);
  const { resume: resumeMtvStorage } = useMtvStorageStore((state) => state);

  const importHandler = async () => {
    if (phrase) {
      setLoading(true);
      try {
        const status = await wallet.restoreFromPhrase(
          phrase,
          VITE_DEFAULT_PASSWORD,
        );
        console.log(status);
        if (status === STATUS_CODE.SUCCESS) {
          await setWallet(wallet);
          await getuserinfo();
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
  };
  const { mutate: getuserinfo } = useRequest(
    {
      url: '/user/getuserinfo',
      arg: { method: 'get', auth: true },
    },
    {
      onSuccess: async (res) => {
        const { email, name, safeLevel } = res.data;
        if (email) {
          setBindStatus(true);
        }
        setUserLevel(safeLevel);
        setUserInfo({ email, nickname: name });

        const { privateKey } = wallet || {};
        if (privateKey) {
          await resumeMtvStorage(privateKey);
        }
        setLoading(true);
        nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
      },
      onError() {
        setLoading(false);
      },
    },
  );
  const phraseChange = (e: any) => {
    setPhrase(e.target.value?.trim());
  };

  return (
    <LayoutThird title='助记词恢复'>
      <div className='pt-6 px-6'>
        <Row className='mb-6' justify='center'>
          <Textarea
            bordered
            fullWidth
            rows={3}
            value={phrase}
            onChange={phraseChange}
            placeholder='助记词'
            initialValue=''
          />
        </Row>
        <Button
          className='mx-auto w-full'
          disabled={!phrase}
          loading={loading}
          onPress={importHandler}>
          恢复
        </Button>
        <Text className='text-center text-11px mt-2'>
          使用默认密码恢复，之后请及时修改
        </Text>
      </div>
    </LayoutThird>
  );
}
