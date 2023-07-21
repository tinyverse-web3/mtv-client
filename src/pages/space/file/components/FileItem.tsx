import { format } from 'date-fns';
import { calcSize } from '@/lib/utils';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
interface FileItemProps {
  item: {
    FileSize: number;
    Filename: string;
    TimeStamp: number;
    URL: string;
  };
  onDownload?: () => void;
}
const FileItem = ({ item, onDownload }: FileItemProps) => {
  const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
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
  const removeItem = async (e: any, id?: string) => {
    e.stopPropagation();
    if (id) {
      console.log('removeItem', id);
      // await remove(id);
    }
  };
  return (
    <div className='border-b-gray-200 border-b-solid border-b py-2 relative'>
      <div
        className='i-mdi-close absolute right-1 top-2 w-6 h-6 text-red'
        onClick={(e) => removeItem(e, item?.Filename)}></div>
      <div
        className='i-mdi-box-download absolute right-1 bottom-1 w-6 h-6 text-blue'
        onClick={(e) => downloadItem(e, item?.Filename)}></div>
      <div className='text-4 font-600 mb-2'>{item.Filename}</div>
      <div className='text-3'>
        <span className='mr-4'>{formatTime(item.TimeStamp)}</span>
        <span>{calcSize(item.FileSize)}</span>
      </div>
    </div>
  );
};
export default FileItem;
