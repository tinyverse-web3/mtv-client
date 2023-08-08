import { useMemo } from 'react';
import { Image } from '@nextui-org/react';

interface AssetsNftItemProps {
  icon: string;
}
export const AssetsNftItem = ({ icon }: AssetsNftItemProps) => {
  const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
  const apiHost = window.JsBridge ? VITE_SDK_LOCAL_HOST : VITE_SDK_HOST;
  const url = useMemo(() => {
    return `${apiHost}/sdk/album/get?Url=${icon}`;
  }, [icon]);
  return (
    <div className='p-2 border border-solid border-gray-200'>
      <Image src={url} className='w-20 h-20' />
    </div>
  );
};
