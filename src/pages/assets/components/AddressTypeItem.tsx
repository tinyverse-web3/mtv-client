import { Image } from '@nextui-org/react';
import Check from '@/assets/images/icon-check.png';

interface AddressItemProps {
  type: string;
  address: string;
  isDefault: boolean;
  onClick?: () => void;
}
export const AddressTypeItem = ({
  type,
  address,
  isDefault,
  onClick,
}: AddressItemProps) => {
  return (
    <div
      className='flex items-center justify-between h-16 bg-gray-100 px-4 rounded-2xl'
      onClick={() => onClick?.()}>
      <div className='flex items-center'>
        <div>
          <p className='text-md mb-2'>{type}</p>
          <p className='text-xs text-gray-500'>{address}</p>
        </div>
        {isDefault && (
          <Image
            src={Check}
            className='w-6 h-6 mr-6'></Image>
        )}
      </div>
    </div>
  );
};
