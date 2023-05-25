import { useState } from 'react';
import { Text, Row, Textarea } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { STATUS_CODE } from '@/lib/account/account';
import { useNavigate } from 'react-router-dom';
import {
  useWalletStore,
  useMtvStorageStore,
  useGlobalStore,
  useAccountStore,
} from '@/store';
import toast from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useRequest } from '@/api';

export default function Phrase() {
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const nav = useNavigate();
  const [phrase, setPhrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumeStatus, setResumeStatus] = useState(false);
  const { account } = useAccountStore((state) => state);
  const { setUserInfo, getLocalUserInfo } = useGlobalStore((state) => state);
  const setWallet = useWalletStore((state) => state.setWallet);
  const {
    resume: resumeMtvStorage,
    init: initMtvStorage,
    mtvStorage,
    // retryResume,
  } = useMtvStorageStore((state) => state);
  // const getStorageUserInfo = async () => {
  //   const userInfo = await mtvStorage?.get('userInfo');
  //   console.log(userInfo);
  //   if (userInfo) {
  //     await setUserInfo(userInfo);
  //   }
  // };
  const importHandler = async () => {
    if (phrase) {
      setLoading(true);
      try {
        const status = await account.restore({
          phrase,
          password: VITE_DEFAULT_PASSWORD,
        });
        if (status === STATUS_CODE.SUCCESS) {
          toast.success('恢复成功');
          nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
        } else {
          toast.success('恢复失败');
        }
        console.log(status);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
  };

  const restoreData = async (privateKey: string) => {
    if (privateKey) {
      if (!resumeStatus) {
        await initMtvStorage(privateKey);
      }
      await resumeMtvStorage();
      await getLocalUserInfo();
    }
  };
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
