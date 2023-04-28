import { Input, Button } from '@nextui-org/react';
import { useWalletStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useList } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useMemo } from 'react';

export default function UserPhrase() {
  const nav = useNavigate();
  const wallet = useWalletStore((state) => state.wallet);
  const [list, { updateAt }] = useList<string>(
    Array.from<string>({ length: 12 }).fill(''),
  );
  const changeHandler = (i: number, value: string) => {
    updateAt(i, value);
  };
  const verify = () => {
    const _phrase = list.join(' ');
    if (_phrase === wallet?.getMnemonic()) {
      nav(ROUTE_PATH.ACCOUNT_VERIFY_SUCCESS);
    } else {
      toast.error('助记词错误');
    }
  };
  const disbaled = useMemo(() => !list.every((v) => !!v), [list]);
  return (
    <LayoutThird title='助记词恢复测试' path={ROUTE_PATH.ACCOUNT_PHRASE}>
      <div className='p-4'>
        <div className='grid grid-cols-4 gap-4 mb-4'>
          {list.map((v, i) => (
            <div key={i}>
              <Input
                aria-label='text'
                value={v}
                className='text-center'
                onChange={(e) => changeHandler(i, e.target.value)}></Input>
            </div>
          ))}
        </div>
        <Button
          disabled={disbaled}
          className='w-full'
          size='lg'
          onPress={verify}>
          恢复测试
        </Button>
      </div>
    </LayoutThird>
  );
}
