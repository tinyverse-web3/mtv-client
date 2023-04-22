import { useMemo } from 'react';
import { useGlobalStore, useWalletStore } from '@/store';
import { Image, Badge } from '@nextui-org/react';
interface Props {
  className?: string;
}
export const UserAvatar = ({ className }: Props) => {
  const { VITE_API_HOST, VITE_API_VERSION } = import.meta.env;
  const { setUserInfo, userInfo } = useGlobalStore((state) => state);
  const { wallet } = useWalletStore((state) => state);
  const imageChange = async (e: any) => {
    const { publicKey, address } = wallet || {};
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('file', image);
    const headers: any = {};
    const signJson = JSON.stringify({ filename: image.name });
    const sign = await wallet?.sign(signJson);
    headers.public_key = publicKey;
    headers.sign = sign;
    headers.address = address;
    const res = await fetch(
      `${VITE_API_HOST}/${VITE_API_VERSION}/user/uploadimg`,
      {
        headers,
        method: 'POST',
        body: formData,
      },
    );
    const { data } = await res.json();
    setUserInfo({
      avatar: data,
    });
  };
  const imageSrc = useMemo(() => {
    return userInfo.avatar || '/logo.png';
  }, [userInfo.avatar]);
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
