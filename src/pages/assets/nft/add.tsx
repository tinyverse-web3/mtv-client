import { Input } from '@/components/form/Input';
import { Textarea } from '@/components/form/Textarea';
import { Button } from '@/components/form/Button';
import { Tabs, Tab } from '@nextui-org/react';
import { useEffect, useMemo, useState } from 'react';
import LayoutThird from '@/layout/LayoutThird';
import { useNavigate } from 'react-router-dom';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
import { useMap } from 'react-use';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

export default function NftAdd() {
  const { t } = useTranslation();
  const [assetsType, setAssetsType] = useState('file');
  const [textLoading, setTextLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');
  const nav = useNavigate();
  const assetsTypes = [
    {
      label: t('pages.assets.nft.tab_file'),
      value: 'file',
    },
    {
      label: t('pages.assets.nft.tab_text'),
      value: 'text',
    },
    // {
    //   label: t('pages.assets.nft.tab_text'),
    //   value: 'gun',
    // },
  ];
  const [data, { set, reset }] = useMap({
    File: null,
    Content: '',
    Name: '',
    Description: '',
  });
  const imageChange = async (e: any) => {
    const image = e.target.files[0];
    set('File', image);
    set('Name', image.name);
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setPreviewSrc(reader.result);
      }
    };
    reader.readAsDataURL(image);
    e.target.value = '';
  };
  const mint = async () => {
    if (assetsType === 'file') {
      await mintNftFile();
    } else {
      await mintText();
    }
  };
  const mintNftFile = async () => {
    setTextLoading(true);
    const { code, msg } = await account.mintNftFile({
      file: data.File,
      Name: data.Name,
      Description: data.Description,
    });
    setTextLoading(false);
    if (code === '000000') {
      toast.success(t('pages.assets.nft.mint_success'));
      nav(-1);
    } else {
      toast.error(msg);
    }
  };
  const mintText = async () => {
    setTextLoading(true);
    const { code, msg } = await account.mintNftText({
      Content: data.Content,
      Name: data.Name,
      Description: data.Description,
    });
    setTextLoading(false);
    if (code === '000000') {
      toast.success(t('pages.assets.nft.mint_success'));
      nav(-1);
    } else {
      toast.error(msg);
    }
  };
  const typeChange = (t: any) => {
    reset();
    setAssetsType(t);
  };
  const textMintDisabled = useMemo(() => {
    return (
      !data.Description ||
      !data.Name ||
      (assetsType === 'text' && !data.Content) ||
      (assetsType === 'file' && !data.File)
    );
  }, [data.Content, data.Name, data.Description, data.File, assetsType]);
  const imgSrc = useMemo(() => {
    return previewSrc || '/upload.png';
  }, [previewSrc]);
  return (
    <LayoutThird title={t('pages.assets.nft.mint_title')}>
      <div className='p-4'>
        <Tabs
          fullWidth
          size='md'
          aria-label='Tabs form'
          onSelectionChange={typeChange}>
          {assetsTypes.map((item) => (
            <Tab key={item.value} title={item.label}></Tab>
          ))}
        </Tabs>
        <div className='pt-2'>
          <div className='mb-4'>
            <Input
              placeholder={t('pages.assets.nft.mint_name_placeholder')}
              value={data.Name}
              onChange={(e: string) => set('Name', e) as any}
            />
          </div>
          <div className='mb-4'>
            <Textarea
              minRows={3}
              maxRows={4}
              value={data.Description}
              onChange={(e: string) => set('Description', e) as any}
              placeholder={t('pages.assets.nft.mint_description_placeholder')}
            />
          </div>
          {assetsType === 'file' ? (
            <div className='mb-2'>
              <div className='border border-solid border-gray-300 flex justify-center items-center p-2 rounded-xl w-40 h-40 mx-auto mb-2'>
                <label className='w-full h-full flex flex-col  items-center justify-center text-blue-500'>
                  {!!previewSrc ? (
                    <img src={previewSrc} className='w-full h-full' />
                  ) : (
                    <>
                      <Icon
                        icon='mdi:cloud-upload-outline'
                        className='text-6xl'
                      />
                      <div className='text-18px'>
                        {t('common.upload.title')}
                      </div>
                    </>
                  )}

                  <input
                    type='file'
                    onChange={imageChange}
                    className='invisible w-0 h-0'
                  />
                </label>
              </div>
              <div className='text-center  '>
                {t('pages.assets.nft.mint_file_hint')}
              </div>
            </div>
          ) : (
            <>
              <div className='mb-2'>
                <Textarea
                  minRows={18}
                  maxRows={100}
                  value={data.Content}
                  onChange={(e: string) => set('Content', e) as any}
                  placeholder={t('pages.assets.nft.mint_content_placeholder')}
                />
              </div>
              <div className='text-3 mb-4 text-right'>
                {t('pages.assets.nft.mint_text_hint')}
              </div>
            </>
          )}
          <Button
            className='w-full'
            disabled={textMintDisabled}
            loading={textLoading}
            onClick={mint}>
            {t('pages.assets.nft.btn_mint')}
          </Button>
        </div>
      </div>
    </LayoutThird>
  );
}
