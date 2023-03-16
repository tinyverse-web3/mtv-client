import { useState } from 'react';
import { Text, Row, Button, Textarea } from '@nextui-org/react';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { useNavigate } from 'react-router-dom';
import { useCheckLogin } from '@/components/LoginModal';
import { useWalletStore, useGlobalStore, useMtvdbStore } from '@/store';
import Page from '@/layout/page';
import toast from 'react-hot-toast';
import { QuestionRestore } from '@/components/Question/QuestionRestore';

export default function Restore() {
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const nav = useNavigate();
  const [phrase, setPhrase] = useState('');

  const initMtvdb = useMtvdbStore((state) => state.init);
  const createMtvdb = useMtvdbStore((state) => state.create);
  const [status, setStatus] = useState('whole');
  const setWallet = useWalletStore((state) => state.setWallet);
  const setMtvdb = useGlobalStore((state) => state.setMtvdb);
  const mtvdbInfo = useGlobalStore((state) => state.mtvdbInfo);

  const importHandler = async () => {
    if (status === 'whole') {
      if (phrase) {
        try {
          const status = await wallet.restoreFromPhrase(
            phrase,
            VITE_DEFAULT_PASSWORD,
          );
          console.log(status);
          if (status === STATUS_CODE.SUCCESS) {
            setWallet(wallet);
            const { publicKey, privateKey } = wallet || {};
            if (privateKey) {
              const { dbAddress, metadataKey } = await createMtvdb(privateKey);
              if (dbAddress && metadataKey) {
                await setMtvdb(dbAddress, metadataKey);
              }
            }
            nav('/home', { replace: true });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  const walletSuccess = async () => {
    setWallet(wallet);
    const { publicKey, privateKey } = wallet || {};
    if (privateKey) {
      const { dbAddress, metadataKey } = mtvdbInfo;
      if (dbAddress && metadataKey) {
        await initMtvdb(privateKey, dbAddress, metadataKey);
      }
    }
    nav('/home', { replace: true });
  };
  const phraseChange = (e: any) => {
    setPhrase(e.target.value?.trim());
  };

  const showWhole = () => {
    setStatus('whole');
  };

  const ShowQuestion = async () => {
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      setStatus('question');
    }
  };
  const questionSubmit = async (shares: string[]) => {
    const status = await wallet.sssResotre(shares, VITE_DEFAULT_PASSWORD);
    console.log(status);
    if (status === STATUS_CODE.SUCCESS) {
      await walletSuccess();
    } else if (status === STATUS_CODE.SHARES_ERROR) {
      toast.error('分片数据错误');
    }
  };
  return (
    <Page showBack={false} title='账号恢复'>
      <div>
        <Row className='mb-8' justify='center'>
          <Button auto className='flex-1 mr-2' onPress={showWhole}>
            助记词恢复
          </Button>
          <Button auto className='flex-1 ml-2' onPress={ShowQuestion}>
            安全问题恢复
          </Button>
        </Row>

        {status === 'whole' && (
          <>
            <Row className='mb-8' justify='center'>
              <Textarea
                bordered
                fullWidth
                value={phrase}
                onChange={phraseChange}
                labelPlaceholder='助记词'
                initialValue=''
              />
            </Row>
            <Button
              className='mx-auto w-full'
              disabled={!phrase}
              onPress={importHandler}>
              恢复
            </Button>
          </>
        )}
        {status === 'question' && (
          <QuestionRestore onSubmit={questionSubmit}></QuestionRestore>
        )}
        <Text className='text-center text-11px mt-2'>
          使用默认密码恢复，之后请及时修改
        </Text>
      </div>
    </Page>
  );
}
