import { Button as NextButton } from '@nextui-org/react';

export default function PasswordItem({item}: any) {
  return (
    <div className='border-b-gray-200 border-b-solid border-b py-2'>
      <div className='text-4 font-600 mb-2'>{item.Title}</div>
      <div className='flex text-3 mb-2'>
        <div className='flex-1'>
          <div className='flex'>
            <span>账号：</span>
            <div>{item.Account}</div>
          </div>
          <div className='flex'>
            <span>密码：</span>
            <div>{item.Password}</div>
          </div>
          <div className='flex'>
            <span>网址：</span>
            <div>{item.Url}</div>
          </div>
        </div>
      </div>
      <div className='flex justify-around'>
        <NextButton auto flat size='xs' className=''>
          复制账号
        </NextButton>
        <NextButton auto flat size='xs' className=''>
          复制密码
        </NextButton>
        <NextButton auto flat size='xs' className=''>
          复制网址
        </NextButton>
      </div>
    </div>
  );
}
