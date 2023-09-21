import { useTranslation } from 'react-i18next';
interface EmptyProps {
  text?: string;
}
export const Empty = ({ text }: EmptyProps) => {
  const { t } = useTranslation();
  return (
    <div className='w-full h-20 flex flex-col justify-center items-center text-sm text-gray-500'>
      <img src='/empty.png' className='w-20 h-20 mb-4' />
      <span>{text || t('common.empty_data')}</span>
    </div>
  );
};
