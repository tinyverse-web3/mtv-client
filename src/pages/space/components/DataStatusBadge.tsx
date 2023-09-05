import { useEffect, useState } from 'react';
import { useInterval } from 'react-use';
import account from '@/lib/account/account';
interface Props {
  className?: string;
}
export const DataStatusBadge = ({ className }: Props) => {
  const [status, setStatus] = useState(0); // 0: 未上传 1: 上传中 2: 上传完成 3: 上传失败
  const getStatus = async () => {
    const { code, data } = await account.getDataStatus();
    if (code === '000000' && data >= 0) {
      setStatus(data);
    }
  };
  const statusColorMap: any = {
    0: '#808080',
    1: '#FFFF00',
    2: '#FF0000',
    3: '#00FF00',
    4: '#00BFFF',
    5: '#FFA500',
  };
  useEffect(() => {
    getStatus();
  }, []);

  useInterval(() => {
    getStatus();
  }, 10000);
  return status > -1 ? (
    <div
      className={'w-4 h-4 rounded-full ' + className}
      style={{ backgroundColor: statusColorMap[status] }}></div>
  ) : (
    <></>
  );
};
