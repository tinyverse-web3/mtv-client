import { Image, Badge } from '@nextui-org/react';
interface Props {
  className?: string;
}
export const UserAvatar = ({ className }: Props) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className='relative w-24 h-24'>
        <div className='rounded-full overflow-hidden w-full h-full'>
          <Image src='/logo.png' className='w-full h-full' />
        </div>
        <div className='i-mdi-camera absolute bottom-0 right-0 text-8'></div>
      </div>
    </div>
  );
};
