import { Image } from '@nextui-org/react';
import { useMemo } from 'react';
interface AlbumItemProps {
  item: {
    FileSize: number;
    FileName: string;
    TimeStamp: number;
    URL: string;
  };
}
const AlbumItem = ({item}: AlbumItemProps) => {
  const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
  const apiHost = window.JsBridge ? VITE_SDK_LOCAL_HOST : VITE_SDK_HOST;
  const url = useMemo(() => {
    return `${apiHost}/sdk/album/get?Url=${item.URL}&FileName=${item.FileName}`;
  }, [item.URL]);
  return (
    <div className='w-20 h-20'>
      <Image src={url} className='w-full h-full'/>
    </div>
  );
};
export default AlbumItem;
