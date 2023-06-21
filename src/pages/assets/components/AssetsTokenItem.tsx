import { Image } from '@nextui-org/react';

interface AssetsTokenItemProps {
  icon?: string;
  symbol: string;
  balance?: number | string;
  dollar?: number | string;
}
export const AssetsTokenItem = ({
  icon,
  symbol,
  balance,
  dollar,
}: AssetsTokenItemProps) => {
  return (
    <div className='flex items-center justify-between h-18 border-b-1 border-b-solid border-b-gray-200'>
      <div className='flex items-center'>
        {icon && (
          <Image
            src={icon}
            className='w-9 h-9 bg-gray-200 rounded-full mr-6'></Image>
        )}
        <span className='text-4 font-600'>{symbol}</span>
      </div>
      <div>
        <div className='text-3.5 font-600 text-right'>{balance}</div>
        {dollar && <div className='text-2  text-right'>${dollar}</div>}
      </div>
    </div>
  );
};