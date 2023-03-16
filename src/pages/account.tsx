import { useState } from 'react';
import { Button, Text, Card } from '@nextui-org/react';
import { useCopyToClipboard } from 'react-use';
import { useWalletStore } from '@/store';
import Page from '@/layout/page';
import { QuestionMaintain } from '@/components/Question/QuestionMaintain';
import { ROUTE_PATH } from '@/router';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCheckLogin } from '@/components/LoginModal';

export default function Account() {
  const nav = useNavigate();
  const [pharseVisible, setPharseVisible] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [phrase, setPhrase] = useState<string | undefined>();
  const wallet = useWalletStore((state) => state.wallet);

  const [_, copyToClipboard] = useCopyToClipboard();

  const toChangePwd = () => {
    nav(ROUTE_PATH.CHANGE_PWD);
  };
  const showPharse = () => {
    const _phrase = wallet?.getMnemonic();
    setPhrase(_phrase);
    if (_phrase) {
      copyToClipboard(_phrase);
      if (pharseVisible == true) return;
      setPharseVisible(true);
      setQuestionVisible(false);
      setTimeout(() => {
        setPharseVisible(false);
      }, 1000 * 5);
    }
  };
  const showQuestion = async () => {
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      setQuestionVisible(!questionVisible);
      setPharseVisible(false);
    }
  };
  const toChangeNickname = async () => {
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.USERINFO);
    }
  };
  return (
    <Page title='账号维护' path={ROUTE_PATH.HOME}>
      <div className='mb-4 pb-2'>
        <Button
          flat
          className='w-full mb-4'
          size='xl'
          color='error'
          onPress={toChangeNickname}>
          个人信息
        </Button>
        <Button
          flat
          className='w-full mb-4'
          size='xl'
          color='error'
          onPress={toChangePwd}>
          修改密码
        </Button>
        <Button
          flat
          className='w-full mb-4'
          size='xl'
          color='error'
          onPress={showPharse}>
          备份助记词
        </Button>

        {pharseVisible ? (
          <Card className='mb-4'>
            <Card.Body>
              <Text>{phrase}</Text>
            </Card.Body>
          </Card>
        ) : (
          <></>
        )}
        {/* <SharesCard /> */}
        <Button
          flat
          className='w-full mb-6'
          size='xl'
          color='error'
          onPress={showQuestion}>
          安全问题备份
        </Button>
        {questionVisible && <QuestionMaintain />}
      </div>
    </Page>
  );
}
