import { useMemo } from 'react';
import { useGlobalStore } from '@/store';

interface Props {
  className?: string;
}
export const UserLevel = ({ className }: Props) => {
  const levelArr = [
    {
      level: 0,
      text: '临时账户，账户无法恢复，数据随时会丢失，请尽快做账户维护。',
    },
    {
      level: 1,
      text: '账户存在单点故障，请尽快做账户维护。',
    },
    {
      level: 2,
      text: '账户依赖其他账户的安全，请尽快做账户维护。',
    },
    {
      level: 3,
      text: '低标准账户，建议提升安全级别。',
    },
    {
      level: 4,
      text: '标准账户，您的账户已经很安全，但还有提升空间。',
    },
    {
      level: 5,
      text: '高标准账户，您的账户已经得到完全的保护。',
    },
  ];
  const { userInfo } = useGlobalStore((state) => state);
  const levelItem = useMemo(
    () => levelArr[userInfo.userLevel || 0],
    [userInfo.userLevel],
  );
  return (
    <div className={`${className}`}>
      <div className='flex items-center mb-1'>
        <span>安全等级：</span>
        <div className='flex-1 overflow-hidden'>
          <div className='h-5 bg-gray-100 w-50 max-w-full rounded-full overflow-hidden'>
            <div
              className={`h-full flex justify-center items-center text-12px bg-blue-600 rounded-full text-white min-w-5`}
              style={{ width: `${20 * levelItem.level}%` }}>
              {levelItem.level}
            </div>
          </div>
        </div>
      </div>
      <div className='text-gray-6'>
        <p className='text-12px'>{levelItem.text}</p>
        <p className='text-12px'>
          只有名字和公钥暴露在外，其他所有数据完全由用户个人控制，保存在个人数字空间。
        </p>
      </div>
    </div>
  );
};
