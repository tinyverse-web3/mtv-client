import { useEffect, useMemo, useState } from 'react';
import { useInterval } from 'react-use';
import account from '@/lib/account/account';
import IconSuccess from '@/assets/images/space/icon-space-network-success.png';
import IconError from '@/assets/images/space/icon-space-network-error.png';
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

  useEffect(() => {
    getStatus();
  }, []);

  useInterval(() => {
    getStatus();
  }, 10000);
  const src = useMemo(() => {
    return status == 2 ? IconSuccess : IconError;
  }, [status]);
  return status > 0 ? (
    <div className={` rounded-full ${status == 2 ? 'w-8 h-8 top-4 right-2' : ' w-6 h-6 rotate-[90deg] top-5 right-3'} ` + className}>
      <img src={src} />
    </div>
  ) : (
    <></>
  );
};
