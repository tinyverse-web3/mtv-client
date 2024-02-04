import { Image } from '@nextui-org/react';

interface WalletOperateItemProps {
  icon?: string;
  title: string;
  onClick?: () => void;
}
export const WalletOperateItem = ({
  icon,
  title,
  onClick,
}: WalletOperateItemProps) => {
  return (
    <div className='flex items-center justify-center h-14 w-full mb-4 bg-gray-50 px-2 rounded-2xl border border-gray-100' onClick={() => onClick?.()}>
      {icon && (
        <Image src={icon} className='w-8 h-8 mr-2'></Image>
      )}
      <div>
        <p className='text-md text-[#1296db]'>{title}</p>
      </div>
    </div>
  );
};
