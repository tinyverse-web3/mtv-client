import { useCopyToClipboard } from 'react-use';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const CopyIcon = ({ text, className }: { text: string, className?:string }) => {
  const {t} = useTranslation()
  const [_, copyToClipboard] = useCopyToClipboard();
  const clickHandler = () => {
    if (text) {
      copyToClipboard(text);
      toast.success(t('common.copy_success'));
    }
  };
  return (
    <div
      className={`i-mdi-content-copy cursor-pointer text-blue-5 w-4 h-4 ${className}`}
      onClick={clickHandler}></div>
  );
};
