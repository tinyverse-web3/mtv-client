import { useMemo, useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { DelConfirmModel } from '@/components/DelConfirmModel';
import account from '@/lib/account/account';
import { Image } from '@chakra-ui/react'
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
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
  const { t } = useTranslation();
  
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
        toast.success(t('common.toast.delete_success'));
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
        toast.success(`${t('pages.space.album.download_text')}: ${data}`);
      } else {
        toast.error(msg);
      }
    }
  };

  return (
    <div className='relative bg-gray-200'>
      <PhotoView src={url}>
        <Image src={url} fit="contain" className='w-full h-full min-h-[100px]' />
      </PhotoView>
      <Icon
        icon='mdi:trash-can-outline'
        className=' absolute right-1 top-1 w-6 h-6 text-red-500 z-10'
        onClick={(e) => showDelModal(e, item?.Filename)}></Icon>
      <Icon
        icon='mdi:box-download'
        className=' absolute right-1 bottom-1 w-6 h-6 text-blue-300 z-10'
        onClick={(e) => downloadItem(e, item?.Filename)}></Icon>
      <DelConfirmModel
        text={t('common.photo')}
        show={showStatus}
        onConfirm={delConfirm}
        onClose={onClose}
      />
    </div>
  );
};
export default AlbumItem;
