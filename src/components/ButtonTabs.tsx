import { useEffect, useMemo, useState } from 'react';

interface Props {
  list: { label: string; value: any }[];
  value?: any;
  onChange?: (v: any) => void;
}
export const ButtonTabs = ({ list, value, onChange }: Props) => {
  const [select, setSelect] = useState(value || list[0]?.value);
  const clickHandler = (v: any) => {
    setSelect(v);
    onChange?.(v)
  };
  useEffect(() => {
    if (value !== undefined) {
      setSelect(value);
    }
  }, [value]);
  return (
    <div className='flex'>
      {list.map((item, i) => (
        <div
          onClick={() => clickHandler(item.value)}
          key={item.value}
          className={`h-10 min-w-[3rem] flex justify-center items-center px-6 text-sm ${
            select === item.value ? 'bg-blue-400 rounded-full text-white ' : ' '
          }`}>
          {item.label}
        </div>
      ))}
    </div>
  );
};
