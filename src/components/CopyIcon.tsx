import { useCopyToClipboard } from 'react-use';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
export const CopyIcon = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const { t } = useTranslation();
  const [_, copyToClipboard] = useCopyToClipboard();
  const clickHandler = () => {
    if (text) {
      copyToClipboard(text);
      toast.success(t('common.copy_success'));
    }
  };
  return (
    <Icon
      icon='mdi:content-copy'
      className={` text-blue-500 text-lg ${className}`}
      onClick={clickHandler}></Icon>
  );
};
