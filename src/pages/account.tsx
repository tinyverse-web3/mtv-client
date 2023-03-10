import { useState } from 'react';
import { Button, Text, Card } from '@nextui-org/react';
import { useCopyToClipboard } from 'react-use';
import { useWalletStore } from '@/store';
import Page from '@/layout/page';
import { SharesCard } from '@/components/SharesCard';
import { QuestionMaintain } from '@/components/Question/QuestionMaintain';
export default function Setting() {
  const [pharseVisible, setPharseVisible] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const wallet = useWalletStore((state) => state.wallet);
  const { phrase } = wallet?.wallet?.mnemonic || {};
  const [_, copyToClipboard] = useCopyToClipboard();
  const showPharse = () => {
    if (phrase) {
      copyToClipboard(phrase);
      if (pharseVisible == true) return;
      setPharseVisible(true);
      setQuestionVisible(false);
      setTimeout(() => {
        setPharseVisible(false);
      }, 1000 * 5);
    }
  };
  const showQuestion = () => {
    setQuestionVisible(!questionVisible);
    setPharseVisible(false);
  };
  return (
    <Page title='账号维护'>
      <div className='mb-4 pb-2'>
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
          问答备份
        </Button>
        {questionVisible && <QuestionMaintain />}
      </div>
    </Page>
  );
}
