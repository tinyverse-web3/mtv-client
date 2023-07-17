import { useState } from 'react';
import { Text, Row, Textarea } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useNavigate } from 'react-router-dom';
import {
  useRestoreStore,
} from '@/store';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';

export default function Phrase() {
  const nav = useNavigate();
  const [phrase, setPhrase] = useState('');
  const [loading, setLoading] = useState(false);
  const { setMnemonic } = useRestoreStore((state) => state);

  const importHandler = async () => {
    if (phrase) {
      setMnemonic(phrase);
      nav(ROUTE_PATH.RESTORE_PHRASE_FEATURE);
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
          下一步
        </Button>
        <Text className='text-center text-11px mt-2'>
          使用默认密码恢复，之后请及时修改
        </Text>
      </div>
    </LayoutThird>
  );
}
