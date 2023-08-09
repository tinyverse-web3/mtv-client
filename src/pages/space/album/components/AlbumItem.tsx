import { Image } from '@nextui-org/react';
import { useMemo, useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { DelConfirmModel } from '@/components/DelConfirmModel';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
interface AlbumItemProps {
  item: {
    FileSize: number;
    Filename: string;
    TimeStamp: number;
    URL: string;
  };
  delSuccess: () => void;
}

const AlbumItem = ({ item, delSuccess }: AlbumItemProps) => {
  const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
  const apiHost = window.JsBridge ? VITE_SDK_LOCAL_HOST : VITE_SDK_HOST;
  const [showStatus, setShowStatus] = useState(false);
  const [delItem, setDelItem] = useState('');
  const url = useMemo(() => {
    return `${apiHost}/sdk/album/get?Url=${item.URL}&Filename=${item.Filename}`;
  }, [item.URL]);
  const removeItem = async (Filename?: string) => {
    if (Filename) {
      const { code, msg } = await account.delAlbum({ Filename });
      if (code === '000000') {
        toast.success(`删除成功`);
        delSuccess?.();
      } else {
        toast.error(msg);
        throw new Error(msg);
      }
    }
  };
  const showDelModal = async (e: any, Filename?: string) => {
    e.stopPropagation();
    if (Filename) {
      setDelItem(Filename);
      setShowStatus(true);
    }
  };
  const delConfirm = async () => {
    await removeItem(delItem);
  };
  const onClose = async () => {
    setShowStatus(false);
  };
  const downloadItem = async (e: any, Filename?: string) => {
    e.stopPropagation();
    console.log('downloadItem', item);
    if (Filename) {
      const { code, msg, data } = await account.downloadAlbum(Filename);
      if (code === '000000') {
        toast.success(`下载地址: ${data}`);
      } else {
        toast.error(msg);
      }
    }
  };

  return (
    <div className='relative'>
      <PhotoView src={url}>
        <Image src={url} className='w-full h-full' />
      </PhotoView>
      <div
        className='i-mdi-trash-can-outline absolute right-1 top-1 w-6 h-6 text-red'
        onClick={(e) => showDelModal(e, item?.Filename)}></div>
      <div
        className='i-mdi-box-download absolute right-1 bottom-1 w-6 h-6 text-blue'
        onClick={(e) => downloadItem(e, item?.Filename)}></div>
      <DelConfirmModel
        text='照片'
        show={showStatus}
        onConfirm={delConfirm}
        onClose={onClose}
      />
    </div>
  );
};
export default AlbumItem;
