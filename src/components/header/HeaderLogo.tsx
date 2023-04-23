import { Text, Avatar } from '@nextui-org/react';

export const HeaderLogo = () => {
  return (
    <div>
      <div className='flex items-center justify-center mb-4'>
        <Avatar src='/logo.png' size='lg' className='ml-3' />
        <Text className='text-10 ml-4 font-600'>芥子空间</Text>
      </div>
      <Text className='text-center text-11px mb-10 text-4 leading-5'>
        我的私人超级账户
        <br />
        进入Web3的快速通道
      </Text>
    </div>
  );
};
