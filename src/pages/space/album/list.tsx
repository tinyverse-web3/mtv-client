import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import LayoutThird from '@/layout/LayoutThird';
import AlbumItem from './components/AlbumItem';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useList } from 'react-use';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Empty } from '@/components/Empty';

export default function Album() {
  const nav = useNavigate();
  const [list, { set: setList }] = useList<any>([]);
  const imageChange = async (e: any) => {
    const image = e.target.files[0];
    const { code, msg } = await account.uploadAlbum({ file: image });

    if (code === '000000') {
      toast.success('上传成功');
      getList();
    } else {
      toast.error(msg);
    }
  };
  const getList = async () => {
    const { code, msg, data } = await account.getAlbumList();
    if (code === '000000') {
      setList(data || []);
    } else {
      toast.error(msg);
    }
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <LayoutThird
      title='相册'
      path={ROUTE_PATH.SPACE_INDEX}
      rightContent={
        <label className='w-full h-full flex items-center justify-center'>
          <div className='i-mdi-plus-circle-outline text-5'></div>
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
                <AlbumItem key={item.URL} item={item} />
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
