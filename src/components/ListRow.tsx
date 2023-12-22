import { Icon } from '@iconify/react'
interface Props {
  label: string;
  value?: string | any;
  onPress?: () => void;
}
export const ListRow = ({ label, value, onPress }: Props) => {
  return (
    <div
      className='flex items-center justify-between h-14 rounded-3xl bg-gray-100 px-4  mb-2 text-sm'
      onClick={onPress}>
      <span>{label}</span>
      <div className='flex items-center'>
        <span>{value}</span>
        <Icon icon="mdi:chevron-right" className='ml-2'></Icon>
      </div>
    </div>
  );
};
