import { Text } from '@nextui-org/react';
interface Props {
  label: string;
  value?: string | any;
  onPress?: () => void;
}
export const ListRow = ({ label, value, onPress }: Props) => {
  return (
    <div
      className='flex items-center justify-between h-14'
      onClick={onPress}>
      <span>{label}</span>
      <div className='flex items-center'>
        <span>{value}</span>
        <div className='i-mdi-chevron-right ml-2'></div>
      </div>
    </div>
  );
};
