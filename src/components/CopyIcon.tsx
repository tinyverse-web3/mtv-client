import { useCopyToClipboard } from 'react-use';
import { toast } from 'react-hot-toast';

export const CopyIcon = ({ text, className }: { text: string, className?:string }) => {
  const [_, copyToClipboard] = useCopyToClipboard();
  const clickHandler = () => {
    if (text) {
      copyToClipboard(text);
      toast.success('复制成功');
    }
  };
  return (
    <div
      className={`i-mdi-content-copy cursor-pointer text-blue-5 w-4 h-4 ${className}`}
      onClick={clickHandler}></div>
  );
};
