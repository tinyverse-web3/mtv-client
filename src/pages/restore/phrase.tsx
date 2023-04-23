import { useState } from 'react';
import { Text, Row, Button, Textarea } from '@nextui-org/react';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { useNavigate } from 'react-router-dom';
import { useWalletStore, useGlobalStore, useMtvdbStore } from '@/store';
import toast from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
export default function Phrase() {
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const nav = useNavigate();
  const [phrase, setPhrase] = useState('');
  const setWallet = useWalletStore((state) => state.setWallet);
  const setMtvdb = useGlobalStore((state) => state.setMtvdb);
  const createMtvdb = useMtvdbStore((state) => state.create);
  const importHandler = async () => {
    if (phrase) {
      try {
        const status = await wallet.restoreFromPhrase(
          phrase,
          VITE_DEFAULT_PASSWORD,
        );
        console.log(status);
        if (status === STATUS_CODE.SUCCESS) {
          setWallet(wallet);
          const { privateKey } = wallet || {};
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
