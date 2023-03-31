import { Image, Badge } from '@nextui-org/react';
interface Props {
  className?: string;
}
export const UserAvatar = ({ className }: Props) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className='relative'>
        <div className='rounded-full overflow-hidden'>
          <Image src='/logo.png' className='w-44 h-44' />
        </div>
        <div className='i-mdi-camera absolute bottom-0 right-4 text-8'></div>
      </div>
    </div>
  );
};
      