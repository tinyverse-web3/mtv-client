import { Card, Text, Button } from '@nextui-org/react';
import { useAccountStore } from '@/store';
import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';

export default function UserPhrase() {
  const nav = useNavigate();
  const { account } = useAccountStore((state) => state);
  
  const toVerify = () => {
    nav(ROUTE_PATH.ACCOUNT_PHRASE_VERIFY);
  };
  const [mnemonic, setMnemonic] = useState<string>('');
  const getMnemonic = async () => {
    const _mnemonic = await account.getMnemonic();
    setMnemonic(_mnemonic);
  };
  useEffect(() => {
    getMnemonic()
  }, []);
  return (
    <LayoutThird title='助记词备份' path={ROUTE_PATH.ACCOUNT}>
      <div className='p-4'>
        <Text className='text-4 mb-4'>
          助记词非常重要，请妥善保管，注意不使用联网工具备份。
        </Text>
        <Card className='mb-4'>
          <Card.Body>
            <Text>{mnemonic}</Text>
          </Card.Body>
        </Card>
        <Button onPress={toVerify} className='w-full' size='lg'>
          下一步
        </Button>
      </div>
    </LayoutThird>
  );
}
