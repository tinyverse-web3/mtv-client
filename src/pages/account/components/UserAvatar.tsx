import { useMemo } from 'react';
import { useGlobalStore, useAccountStore } from '@/store';
import { Image, Badge } from '@nextui-org/react';
interface Props {
  className?: string;
}
export const UserAvatar = ({ className }: Props) => {
  const { account } = useAccountStore((state) => state);
  const { VITE_IPFS_HOST, VITE_IPFS_LOCAL_HOST } = import.meta.env;
  const ipfsHost = window.JsBridge ? VITE_IPFS_LOCAL_HOST : VITE_IPFS_HOST;
  const imageChange = async (e: any) => {
    const image = e.target.files[0];
    await account.updateAvatar({ file: image });
    // setUserInfo({
    //   avatar: data,
    // });
  };
  const imageSrc = useMemo(() => {
    return account.accountInfo.avatar
      ? `${ipfsHost}/${account.accountInfo.avatar}`
      : '/logo.png';
  }, [account.accountInfo]);
  return (
    <div className={`flex justify-center ${className}`}>
      <label className='relative w-24 h-24'>
        <div className='rounded-full overflow-hidden w-full h-full'>
          <Image src={imageSrc} className='w-full h-full' />
        </div>
        <div className='i-mdi-camera absolute bottom-0 right-0 text-8 text-gray-700'></div>
        <input
          type='file'
          accept='image/*'
          onChange={imageChange}
          className='invisible'
        />
      </label>
    </div>
  );
};
