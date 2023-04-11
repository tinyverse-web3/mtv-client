import { useState } from 'react';
import { Text, Row, Button, Textarea } from '@nextui-org/react';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { useNavigate } from 'react-router-dom';
import { useWalletStore, useGlobalStore, useMtvdbStore } from '@/store';
import { useRequest } from '@/api';
import toast from 'react-hot-toast';
import { QuestionRestore } from '@/components/question/QuestionRestore';
import { VerifyMail } from '@/components/VerifyMail';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
export default function Restore() {
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const nav = useNavigate();
  const [phrase, setPhrase] = useState('');

  const initMtvdb = useMtvdbStore((state) => state.init);
  const [serverShare, setServerShare] = useState('');
  const [questionList, setQuestionList] = useState<any[]>([]);
  const [visibly, setVisibly] = useState(false);
  const createMtvdb = useMtvdbStore((state) => state.create);
  const [status, setStatus] = useState('whole');
  const setWallet = useWalletStore((state) => state.setWallet);
  const setMaintain = useGlobalStore((state) => state.setMaintain);
  const setMtvdb = useGlobalStore((state) => state.setMtvdb);
  const setUserInfo = useGlobalStore((state) => state.setUserInfo);

  const { mutate: getuserinfo } = useRequest(
    {
      url: '/user/getuserinfo',
      arg: { method: 'get', auth: true },
    },
    {
      onSuccess: async (res) => {
        const { sssData, email, dbAddress, ipns, name } = res.data;
        setMaintain(!!sssData);
        setUserInfo({ email, nickname: name });
        setMtvdb(dbAddress, ipns);

        const { privateKey } = wallet || {};
        if (privateKey && dbAddress && ipns) {
          await initMtvdb(privateKey, dbAddress, ipns);
        }
        nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
      },
    },
  );
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
            nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  const walletSuccess = async () => {};
  const phraseChange = (e: any) => {
    setPhrase(e.target.value?.trim());
  };

  const showWhole = () => {
    setStatus('whole');
  };
  const ShowQuestion = async () => {
    if (!serverShare) {
      setVisibly(true);
    } else {
      setStatus('question');
    }
  };
  const questionSubmit = async (shares: string[]) => {
    const status = await wallet.sssResotre(shares, VITE_DEFAULT_PASSWORD);
    console.log(status);
    if (status === STATUS_CODE.SUCCESS) {
      await setWallet(wallet);
      await getuserinfo();
    } else if (status === STATUS_CODE.SHARES_ERROR) {
      toast.error('分片数据错误');
    }
  };
  const verifySubmit = ({ shareKey, questions }: any) => {
    setServerShare(shareKey);
    setQuestionList(questions);
  };
  return (
    <LayoutThird title='账号恢复'>
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
          <QuestionRestore
            serverShare={serverShare}
            questionList={questionList}
            onSubmit={questionSubmit}></QuestionRestore>
        )}
        <VerifyMail
          visibly={visibly}
          onChange={(e) => setVisibly(e)}
          onSubmit={verifySubmit}
        />
        <Text className='text-center text-11px mt-2'>
          使用默认密码恢复，之后请及时修改
        </Text>
      </div>
    </LayoutThird>
  );
}
