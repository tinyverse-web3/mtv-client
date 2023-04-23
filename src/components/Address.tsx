import { useCopyToClipboard } from 'react-use';
import toast from 'react-hot-toast';
interface Props {
  address?: string;
}
export const Address = ({ address }: Props) => {
  const [_, copyToClipboard] = useCopyToClipboard();
  const shortAddress = `${address?.substring(0, 5)}*****${address?.substring(
    address?.length - 5,
  )}`;
  const clickHandler = () => {
    if (address) {
      // copyToClipboard(address);
      // toast.success('复制成功');
    }
  };
  return (
    <div
      className='cursor-pointer h-6 flex justify-center items-center text-4'
      onClick={clickHandler}>
      {shortAddress}
    </div>
  );
};
