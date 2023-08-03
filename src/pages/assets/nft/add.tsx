import { Input } from '@/components/form/Input';
import { Textarea } from '@/components/form/Textarea';
import { Button } from '@/components/form/Button';
import { useState } from 'react';
import LayoutThird from '@/layout/LayoutThird';
import { useNavigate } from 'react-router-dom';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';

export default function NftAdd() {
  const [assetsType, setAssetsType] = useState('file');
  const [text, setText] = useState('');
  const nav = useNavigate();
  const assetsTypes = [
    {
      label: '文件',
      value: 'file',
    },
    {
      label: '内容',
      value: 'text',
    },
  ];
  const imageChange = async (e: any) => {
    const image = e.target.files[0];
    const { code, msg } = await account.mintNftFile(image);
    if (code === '000000') {
      toast.success('铸造成功');
      nav(-1);
    } else {
      toast.error(msg);
    }
  };
  return (
    <LayoutThird title='铸造NFT'>
      <div className='p-4'>
        <div>
          <div className='flex mb-4'>
            {assetsTypes.map((item) => (
              <div className='w-20 flex justify-center' key={item.value}>
                <div
                  className={`${
                    assetsType === item.value
                      ? 'border-b-2 border-b-solid text-blue-5'
                      : ''
                  } cursor-pointer`}
                  onClick={() => setAssetsType(item.value)}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        
          {assetsType === 'file' ? (
            <div className='pt-10'>
            <div>
              <div className='border border-solid border-gray-300 flex justify-center items-center p-8 rounded w-40 h-40 mx-auto mb-2'>
                <label className='w-full h-full flex cursor-pointer'>
                  <img src='/upload.png' alt='' />
                  <input
                    type='file'
                    onChange={imageChange}
                    className='invisible w-0 h-0'
                  />
                </label>
              </div>
              <div className='text-center text-2 '>上传文件</div>
            </div>
            </div>
          ) : (
            <div className='pt-2'>
              
              <div className='mb-2'>
                <Textarea
                  minRows={22}
                  maxRows={100}
                  value={text}
                  onChange={(e: string) => setText(e?.trim())}
                  placeholder='内容'
                />
              </div>
              <div className='text-3 mb-4 text-right'>最大内容8k字节</div>
              <Button className='w-full'>铸造</Button>
            </div>
          )}
        
      </div>
    </LayoutThird>
  );
}
