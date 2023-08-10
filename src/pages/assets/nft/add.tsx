import { Input } from '@/components/form/Input';
import { Textarea } from '@/components/form/Textarea';
import { Button } from '@/components/form/Button';
import { useMemo, useState } from 'react';
import LayoutThird from '@/layout/LayoutThird';
import { useNavigate } from 'react-router-dom';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
import { useMap } from 'react-use';

export default function NftAdd() {
  const [assetsType, setAssetsType] = useState('file');
  const [textLoading, setTextLoading] = useState(false);
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
  const [data, { set, setAll, remove, reset }] = useMap({
    Content: '',
    Name: '',
    Description: '',
  });
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
  const mintText = async () => {
    if (!data.Content || !data.Name || !data.Description) {
      toast.error('请填写完整');
      return;
    }
    setTextLoading(true);
    const { code, msg } = await account.mintNftText({
      Content: data.Content,
      Name: data.Name,
      Description: data.Description,
    });
    setTextLoading(false);
    if (code === '000000') {
      toast.success('铸造成功');
      nav(-1);
    } else {
      toast.error(msg);
    }
  };
  const textMintDisabled = useMemo(() => {
    return !data.Content || !data.Name || !data.Description;
  }, [data.Content, data.Name, data.Description]);
  return (
    <LayoutThird title='发行NFT'>
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
            <div className='mb-4'>
              <Input
                placeholder='标题'
                value={data.Name}
                onChange={(e: string) => (data.Name = e.trim())}></Input>
            </div>
            <div className='mb-4'>
              <Textarea
                minRows={3}
                maxRows={4}
                value={data.Description}
                onChange={(e: string) => (data.Description = e.trim())}
                placeholder='描述'
              />
            </div>
            <div className='mb-2'>
              <Textarea
                minRows={18}
                maxRows={100}
                value={data.Content}
                onChange={(e: string) => (data.Content = e.trim())}
                placeholder='内容'
              />
            </div>
            <div className='text-3 mb-4 text-right'>最大内容8k字节</div>
            <Button
              className='w-full'
              loading={textLoading}
              onClick={mintText}>
              铸造
            </Button>
          </div>
        )}
      </div>
    </LayoutThird>
  );
}
