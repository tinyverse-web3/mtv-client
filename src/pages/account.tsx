import { useState } from 'react';
import { Button, Text, Card } from '@nextui-org/react';
import { useCopyToClipboard } from 'react-use';
import { useWalletStore } from '@/store';
import Page from '@/layout/page';
import { SharesCard } from '@/components/SharesCard';
import { Question } from '@/components/Question';
export default function Setting() {
  const [pharseVisible, setPharseVisible] = useState(false);
  const wallet = useWalletStore((state) => state.wallet);
  const { phrase } = wallet?.wallet?.mnemonic || {};
  const [_, copyToClipboard] = useCopyToClipboard();
  const showPharse = () => {
    if (phrase) {
      copyToClipboard(phrase);
      if (pharseVisible == true) return;
      setPharseVisible(true);
      setTimeout(() => {
        setPharseVisible(false);
      }, 1000 * 5);
    }
  };
  return (
    <Page title='账号维护'>
      <div className='mb-6'>
        <Button
          flat
          className='w-full mb-6'
          size='xl'
          color='error'
          onPress={showPharse}>
          备份助记词
        </Button>

        {pharseVisible ? (
          <Card>
            <Card.Body>
              <Text>{phrase}</Text>
            </Card.Body>
          </Card>
        ) : (
          <></>
        )}
      </div>
      <SharesCard />
      <Question/>
    </Page>
  );
}
