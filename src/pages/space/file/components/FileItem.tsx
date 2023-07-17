import { Image } from '@nextui-org/react';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { calcSize } from '@/lib/utils';
interface FileItemProps {
  item: {
    FileSize: number;
    Filename: string;
    TimeStamp: number;
    URL: string;
  };
}
const FileItem = ({ item }: FileItemProps) => {
  const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
  const apiHost = window.JsBridge ? VITE_SDK_LOCAL_HOST : VITE_SDK_HOST;
  const formatTime = (time: number) => {
    if (!time) return;
    if (time.toString().length === 10) {
      time = time * 1000;
    }
    return format(new Date(time), 'yyyy-MM-dd HH:mm:ss');
  };

  return (
    <div className='border-b-gray-200 border-b-solid border-b py-2'>
      <div className='text-4 font-600 mb-2'>{item.Filename}</div>
      <div className='text-3'>
        <span className='mr-4'>{formatTime(item.TimeStamp)}</span>
        <span>{calcSize(item.FileSize)}</span>
      </div>
    </div>
  );
};
export default FileItem;
