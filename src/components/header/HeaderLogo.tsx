import { Text, Image } from '@nextui-org/react';

export const HeaderLogo = () => {
  return (
    <div>
      <div className='flex items-center justify-center mb-8'>
        <Image src='/logo.png' className='w-14 h-14 mx-0' />
        <Text className='text-10 ml-2 font-500 tracking-0.4'>芥子空间</Text>
      </div>
      <Text className='text-center text-11px mb-14 text-4 leading-5 tracking-0.2'>
        我的私人超级账户
        <br />
        进入Web3的快速通道
      </Text>
    </div>
  );
};