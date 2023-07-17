import { Input, Button } from '@nextui-org/react';
import { useAccountStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useList } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useEffect, useMemo, useState } from 'react';
import { cloneDeep } from 'lodash';
import account from '@/lib/account/account';

export default function UserPhrase() {
  const nav = useNavigate();
  const [emptyList, setEmptyList] = useState<number[]>([]);
  const [list, { updateAt, set }] = useList<string>(
    Array.from<string>({ length: 12 }).fill(''),
  );
  const changeHandler = (i: number, value: string) => {
    updateAt(i, value);
  };
  const [mnemonic, setMnemonic] = useState<string>('');
  const getMnemonic = async () => {
    const _mnemonic = await account.getMnemonic();
    setMnemonic(_mnemonic);
  };
  useEffect(() => {
    getMnemonic();
  }, []);
  const verify = () => {
    const _phrase = list.join(' ');
    if (_phrase === mnemonic) {
      nav(ROUTE_PATH.ACCOUNT_VERIFY_SUCCESS);
    } else {
      toast.error('助记词错误');
    }
  };
  const phrase = useMemo(() => mnemonic?.split(' ') || [], [mnemonic]);
  const getFourUniqueNumbers = (range: number, arr: string[]) => {
    const len = arr.length;
    const numbers: number[] = [];
    const _list = cloneDeep(arr);
    while (numbers.length < range) {
      let num = Math.floor(Math.random() * len);
      if (!numbers.includes(num)) {
        numbers.push(num);
        _list[num] = '';
      }
    }
    setEmptyList(numbers);
    return _list;
  };
  useEffect(() => {
    if (phrase.length > 1) {
      const _phrase = getFourUniqueNumbers(4, phrase);
      set(_phrase);
    }
  }, [phrase]);
  const disbaled = useMemo(() => !list.every((v) => !!v), [list]);
  return (
    <LayoutThird title='助记词恢复测试'>
      <div className='p-4'>
        <div className='grid grid-cols-4 gap-4 mb-4'>
          {list.map((v, i) => (
            <div key={i}>
              <Input
                readOnly={!emptyList.includes(i)}
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
