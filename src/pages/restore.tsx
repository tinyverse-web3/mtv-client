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
import { useWalletStore } from '@/store';
import Page from '@/layout/page';

export default function Restore() {
  const nav = useNavigate();
  const [phrase, setPhrase] = useState('');
  const [shareA, setShareA] = useState('');
  const [shareB, setShareB] = useState('');
  const [shareC, setShareC] = useState('');
  const [status, setStatus] = useState('whole');
  const setWallet = useWalletStore((state) => state.setWallet);
  const [pwd, setPwd] = useState('');
  const importHandler = async () => {
    if (status === 'whole') {
      if (phrase && pwd) {
        try {
          const status = await wallet.restoreWallet(phrase, pwd);
          console.log(status);
          if (status === STATUS_CODE.SUCCESS) {
            nav('/home', { replace: true });
            setWallet(wallet);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      if (shareA && shareB && pwd) {
        const sss = new Shamir();
        const combineKey = await sss.combine([shareA, shareB]);
        console.log(combineKey);
        const status = await wallet.restoreFromKey(combineKey, pwd);
        if (status === STATUS_CODE.SUCCESS) {
          nav('/home', { replace: true });
        }
      }
    }
  };
  const phraseChange = (e: any) => {
    setPhrase(e.target.value);
  };
  const pwdChange = (e: any) => {
    setPwd(e.target.value);
  };
  const shareAChange = (e: any) => {
    setShareA(e.target.value);
  };
  const shareBChange = (e: any) => {
    setShareB(e.target.value);
  };
  const shareCChange = (e: any) => {
    setShareB(e.target.value);
  };
  const showWhole = () => {
    setStatus('whole');
  };
  const getSssFromServer = async () => {
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      setShareA('123132');
    }
  };
  const ShowSss = () => {
    setStatus('sss');
  };
  return (
    <Page showBack={false} title='账号恢复'>
      <div>
        <Row className='mb-8' justify='center'>
          <Button auto className='flex-1 mr-2' onPress={showWhole}>
            助记词恢复
          </Button>
          <Button auto className='flex-1 ml-2' onPress={ShowSss}>
            分片私钥恢复
          </Button>
        </Row>

        {status === 'whole' ? (
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
        ) : (
          <>
            {!shareA ? (
              <Row className='mb-8' justify='center'>
                <Button onPress={getSssFromServer}>从服务器获取分片</Button>
              </Row>
            ) : (
              <Row className='mb-8' justify='center'>
                <Textarea
                  fullWidth
                  bordered
                  value={shareA}
                  onChange={shareAChange}
                  labelPlaceholder='分片A'
                  initialValue=''
                />
              </Row>
            )}
            <Row className='mb-8' justify='center'>
              <Textarea
                bordered
                fullWidth
                value={shareB}
                onChange={shareBChange}
                labelPlaceholder='分片B'
                initialValue=''
              />
            </Row>
            <Row className='mb-8' justify='center'>
              <Textarea
                bordered
                fullWidth
                value={shareC}
                onChange={shareCChange}
                labelPlaceholder='分片C'
                initialValue=''
              />
            </Row>
          </>
        )}

        <Row className='mb-8' justify='center'>
          <Input
            clearable
            bordered
            labelPlaceholder='密码'
            initialValue=''
            value={pwd}
            fullWidth
            type='password'
            onChange={pwdChange}
          />
        </Row>
        <Button className='mx-auto mt-4' onPress={importHandler}>
          恢复
        </Button>
      </div>
    </Page>
  );
}
