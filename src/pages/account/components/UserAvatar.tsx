import { useMemo } from 'react';
import { useAccountStore } from '@/store';
import { Image, Badge } from '@nextui-org/react';
import account from '@/lib/account/account';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
interface Props {
  className?: string;
}
export const UserAvatar = ({ className }: Props) => {
  const { t } = useTranslation();
  const { accountInfo, getLocalAccountInfo } = useAccountStore(
    (state) => state,
  );
  const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
  const apiHost = window.JsBridge ? VITE_SDK_LOCAL_HOST : VITE_SDK_HOST;
  const imageChange = async (e: any) => {
    const image = e.target.files[0];
    const { code, msg } = await account.updateAvatar({ file: image });
    e.target.value = '';
    if (code === '000000') {
      toast.success(t('pages.common.upload.avatar_success'));
      await getLocalAccountInfo();
    } else {
      toast.error(msg);
    }
  };
  const imageSrc = useMemo(() => {
    return accountInfo.avatar
      ? `${apiHost}/sdk/msg/getAvatar?DestPubkey=${accountInfo.publicKey}`
      : '/logo.png';
  }, [accountInfo.avatar]);
  return (
    <div className={`flex justify-center w-full h-full ${className}`}>
      <label className='relative w-full h-full'>
        <div className='rounded-full overflow-hidden w-full h-full'>
          <Image src={imageSrc} className='w-full h-full' />
        </div>
        <Icon
          icon='mdi:camera'
          className=' absolute  bottom-0 right-0 text-2xl text-gray-700 z-10'
        />
        <input
          type='file'
          accept='image/*'
          onChange={imageChange}
          className='invisible w-0'
        />
      </label>
    </div>
  );
};
