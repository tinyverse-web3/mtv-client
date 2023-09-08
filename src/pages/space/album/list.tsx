import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import LayoutThird from '@/layout/LayoutThird';
import AlbumItem from './components/AlbumItem';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useList } from 'react-use';
import { useAlbumStore } from '@/store';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Empty } from '@/components/Empty';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react'

export default function Album() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { list, getList } = useAlbumStore((state) => state);
  const [loading, setLoading] = useState(false);
  const imageChange = async (e: any) => {
    const image = e.target.files[0];
    const { code, msg } = await account.uploadAlbum({ file: image });
    e.target.value = '';
    if (code === '000000') {
      toast.success(t('pages.space.album.upload_success'));
      getList();
    } else {
      toast.error(msg);
    }
  };
  const delSuccess = () => {
    getList();
  };
  const getAlbumList = async () => {
    if (!list?.length) {
      setLoading(true);
    }
    await getList();
    setLoading(false);
  };
  useEffect(() => {
    getAlbumList();
  }, []);
  return (
    <LayoutThird
      title={t('pages.space.album.title')}
      path={ROUTE_PATH.SPACE_INDEX}
      loading={loading}
      rightContent={
        <label className='w-full h-full flex items-center justify-center'>
          <Icon icon='mdi:plus-circle-outline' className=' text-xl'/>
          <input
            type='file'
            accept='image/*'
            onChange={imageChange}
            className='invisible w-0 h-0'
          />
        </label>
      }>
      <div className='p-4'>
        <PhotoProvider>
          {list.length ? (
            <div className='grid grid-cols-3 gap-4 ustify-items-center'>
              {list.map((item) => (
                <AlbumItem key={item.URL} item={item} delSuccess={delSuccess} />
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </PhotoProvider>
      </div>
    </LayoutThird>
  );
}
