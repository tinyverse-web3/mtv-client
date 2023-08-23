import { useState } from 'react';
import { Text, Row, Textarea } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useNavigate } from 'react-router-dom';
import { useRestoreStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
export default function Phrase() {
  const nav = useNavigate();
  const [phrase, setPhrase] = useState('');
  const [loading, setLoading] = useState(false);
  const { setMnemonic, setMnemonicFile } = useRestoreStore((state) => state);
  const [type, setType] = useState('file');
  const types = [
    {
      label: '助记词加密文件',
      value: 'file',
    },
    {
      label: '助记词',
      value: 'text',
    },
  ];
  const importHandler = async () => {
    if (phrase) {
      setMnemonic(phrase);
      nav(ROUTE_PATH.RESTORE_PHRASE_FEATURE);
    }
  };
  const fileChange = async (e: any) => {
    const image = e.target.files[0];
    if (image) {
      setMnemonicFile(image);
      nav(ROUTE_PATH.RESTORE_PHRASE_FEATURE);
    }
  };
  const phraseChange = (e: any) => {
    setPhrase(e.target.value?.trim());
  };

  return (
    <LayoutThird title='助记词恢复'>
      <div className='pt-6 px-6'>
        <div className='flex mb-6'>
          {types.map((item) => (
            <div className='w-30 flex justify-center' key={item.value}>
              <div
                className={`${
                  type === item.value
                    ? 'border-b-2 border-b-solid text-blue-5'
                    : ''
                } cursor-pointer`}
                onClick={() => setType(item.value)}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {type === 'file' ? (
          <div>
            <div className='border border-solid border-gray-300 flex justify-center items-center p-8 rounded w-40 h-40 mx-auto mb-2'>
              <label className='w-full h-full flex cursor-pointer'>
                <img src='/upload.png' alt='' />
                <input
                  type='file'
                  onChange={fileChange}
                  className='invisible w-0 h-0'
                />
              </label>
            </div>
            <div className='text-center  '>上传助记词加密文件</div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </LayoutThird>
  );
}
