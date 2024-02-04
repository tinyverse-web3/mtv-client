import { Icon } from '@iconify/react';
import { Image } from '@nextui-org/react';

interface WalletHeaderProps {
  icon?: string;
  address: string;
  dollar?: number | string;
  type: string;
  onClick?: () => void;
  onManage?: () => void;
}
export const WalletHeader = ({
  icon,
  address,
  dollar,
  type,
  onManage
}: WalletHeaderProps) => {
  return (
    <div
      className='flex items-center justify-between h-20 mb-4 px-4'>
      <div className='flex items-center w-4/5'>
        {icon && (
          <Image
            src={icon}
            className='w-8 h-8 mr-4'></Image>
        )}
        <div>
          <p className='text-md mb-2'>{address}</p>
          {type === 'Tinyverse' && (
          <p className='text-base font-bold'>{dollar} TVS</p>
          )}
          {(type === 'Ethereum' || type === 'Bitcoin') && (
          <p className='text-base font-bold'>{dollar}</p>
          )}
        </div>
      </div>
    </div>
  );
};
