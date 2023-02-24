import { Text } from '@nextui-org/react';

interface Props {
  address?: string;
}
export const Address = ({ address }: Props) => {
  const shortAddress = `${address?.substring(0, 5)}*****${address?.substring(
    address?.length - 5,
  )}`;
  return (
    <div className='h-5 flex justify-center items-center'>
      <Text className='text-center text-4'>{shortAddress}</Text>
    </div>
  );
};
