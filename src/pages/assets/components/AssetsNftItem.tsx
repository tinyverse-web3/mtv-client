import { Image } from '@nextui-org/react';

interface AssetsNftItemProps {
  icon: string;
}
export const AssetsNftItem = ({ icon }: AssetsNftItemProps) => {
  return (
    <div className='p-2 border border-solid border-gray-200'>
      <Image src={icon} className='w-20 h-20' />
    </div>
  );
};
