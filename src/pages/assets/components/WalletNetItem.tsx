import { Image } from '@nextui-org/react';

interface WalletNetItemProps {
  icon?: string;
  symbol: string;
  chain: string;
  onClick?: () => void;
}
export const WalletNetItem = ({
  icon,
  symbol,
  chain,
  onClick,
}: WalletNetItemProps) => {
  return (
    <div
      className='flex items-center justify-between h-16 bg-gray-100 px-4 rounded-2xl'
      onClick={() => onClick?.()}>
      <div className='flex items-center'>
        {icon && (
          <Image
            src={icon}
            className='w-6 h-6 mr-6'></Image>
        )}
        <div>
          <p className='text-md mb-2'>{symbol}</p>
          <p className='text-xs text-gray-500'>{chain}</p>
        </div>
      </div>
    </div>
  );
};
