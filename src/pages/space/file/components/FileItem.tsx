import { format } from 'date-fns';
import { useState } from 'react';
import { calcSize } from '@/lib/utils';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
import { DelConfirmModel } from '@/components/DelConfirmModel';
interface FileItemProps {
  item: {
    FileSize: number;
    Filename: string;
    TimeStamp: number;
    URL: string;
  };
  type: string;
  onDownload?: () => void;
  delSuccess?: () => void;
}
const FileItem = ({ item, onDownload, delSuccess, type }: FileItemProps) => {
  const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
  const [showStatus, setShowStatus] = useState(false);
  const [delItem, setDelItem] = useState('');
  const apiHost = window.JsBridge ? VITE_SDK_LOCAL_HOST : VITE_SDK_HOST;
  const formatTime = (time: number) => {
    if (!time) return;
    if (time.toString().length === 10) {
      time = time * 1000;
    }
    return format(new Date(time), 'yyyy-MM-dd HH:mm:ss');
  };
  const downloadItem = async (e: any, Filename?: string) => {
    e.stopPropagation();
    console.log('downloadItem', item);
    onDownload && onDownload();
  };
  const removeItem = async (Filename?: string) => {
    const { code, msg } = await account.delFile({ Filename, Type: type });
    if (code === '000000') {
      toast.success(`删除成功`);
      delSuccess?.();
    } else {
      toast.error(msg);
      throw new Error(msg);
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
  return (
    <div className='border-b-gray-200 border-b-solid border-b py-2 relative'>
      <div
        className='i-mdi-trash-can-outline absolute right-1 top-2 w-6 h-6 text-red'
        onClick={(e) => showDelModal(e, item?.Filename)}></div>
      <div
        className='i-mdi-box-download absolute right-1 bottom-1 w-6 h-6 text-blue'
        onClick={(e) => downloadItem(e, item?.Filename)}></div>
      <div className='text-4 font-600 mb-2'>{item.Filename}</div>
      <div className='text-3'>
        <span className='mr-4'>{formatTime(item.TimeStamp)}</span>
        <span>{calcSize(item.FileSize)}</span>
      </div>
      <DelConfirmModel
        text='文件'
        show={showStatus}
        onConfirm={delConfirm}
        onClose={onClose}
      />
    </div>
  );
};
export default FileItem;
