import { useEffect, useState } from 'react';
import {
  Text,
  Container,
  Row,
  Col,
  Button,
  Input,
  Textarea,
} from '@nextui-org/react';
import wallet, { STATUS_CODE } from '@/lib/wallet';
import { useNavigate } from 'react-router-dom';
import { Shamir } from '@/lib/account';
import { useCheckLogin } from '@/components/LoginModal';
import { useWalletStore, useGlobalStore, useMtvdbStore } from '@/store';
import Page from '@/layout/page';
import { useRequest } from '@/api';
import { QuestionRestore } from '@/components/Question/QuestionRestore';

export default function Restore() {
  const nav = useNavigate();
  const [phrase, setPhrase] = useState('');

  const [shareC, setShareC] = useState('');
  const [questionSk, setQuestionSk] = useState('');
  const initMtvdb = useMtvdbStore((state) => state.init);
  const [status, setStatus] = useState('whole');
  const setWallet = useWalletStore((state) => state.setWallet);

  const userInfo = useGlobalStore((state) => state.userInfo);

  const [pwd, setPwd] = useState('');
  const importHandler = async () => {
    if (status === 'whole') {
      if (phrase) {
        try {
          const status = await wallet.restoreWallet(phrase, pwd);
          console.log(status);
          if (status === STATUS_CODE.SUCCESS) {
            await walletSuccess();
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      if (questionSk) {
        const status = await wallet.restoreFromKey(questionSk, pwd);
        if (status === STATUS_CODE.SUCCESS) {
          await walletSuccess();
        }
      }
    }
  };
  const walletSuccess = async () => {
    setWallet(wallet);
    const { privateKey } = wallet.wallet || {};
    if (privateKey) {
      const { dbAddress, metadataKey } = userInfo?.mtvdb || {};
      if (dbAddress && metadataKey) {
        await initMtvdb(privateKey, dbAddress, metadataKey);
      }
    }
    nav('/home', { replace: true });
  };
  const phraseChange = (e: any) => {
    setPhrase(e.target.value?.trim());
  };
  const pwdChange = (e: any) => {
    setPwd(e.target.value);
  };

  const shareCChange = (e: any) => {
    setShareC(e.target.value);
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
  const questionSubmit = async (sk: string) => {
    // setQuestionSk(sk);
    const status = await wallet.restoreFromKey(sk, '123456');
    console.log(status)
    if (status === STATUS_CODE.SUCCESS) {
      await walletSuccess();
    }
    console.log(sk);
  };
  return (
    <Page showBack={false} title='账号恢复'>
      <div>
        <Row className='mb-8' justify='center'>
          <Button auto className='flex-1 mr-2' onPress={showWhole}>
            助记词恢复
          </Button>
          <Button auto className='flex-1 ml-2' onPress={ShowQuestion}>
            问答恢复
          </Button>
        </Row>

        {status === 'whole' && (
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
        )}
        {status === 'question' && (
          <QuestionRestore onSubmit={questionSubmit}></QuestionRestore>
        )}
      </div>
    </Page>
  );
}
