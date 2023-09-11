import { Image } from '@nextui-org/react';

interface AssetsTokenItemProps {
  icon?: string;
  symbol: string;
  balance?: number | string;
  dollar?: number | string;
  onClick?: () => void;
}
export const AssetsTokenDetailItem = ({
  icon,
  symbol,
  balance,
  dollar,
  onClick,
}: AssetsTokenItemProps) => {
  return (
    <div className='flex flex-col items-center ' onClick={() => onClick?.()}>
      {icon && (
        <Image
          src={icon}
          className='w-16 h-16 mb-4 bg-gray-200 rounded-full '></Image>
      )}

      <div className='text-2xl font-500 text-center'>
        <span>{balance}</span>
        <span className='ml-2'>{symbol}</span>
      </div>
      {dollar && <div className='  text-right'>${dollar}</div>}
    </div>
  );
};
