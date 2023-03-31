import { Text } from '@nextui-org/react';

interface Props {
  className?: string;
}
export const UserLevel = ({ className }: Props) => {
  return (
    <div className={`${className}`}>
      <div className='flex items-center justify-center mb-1'>
        <span>安全等级：</span>
        <div className='h-5 bg-gray-100 w-60 rounded-full overflow-hidden'>
          <div className='w-1/4 h-full flex justify-center items-center text-12px bg-blue-600 rounded-full text-white'>
            1
          </div>
        </div>
      </div>
      <div className='indent-22'>
        <span>裸账户，只有助记词恢复</span>
      </div>
    </div>
  );
};
