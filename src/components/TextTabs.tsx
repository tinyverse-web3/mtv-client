import { useEffect, useMemo, useState } from 'react';

interface Props {
  list: { label: string; value: any }[];
  value?: any;
  onChange?: (v: any) => void;
}
export const TextTabs = ({ list, value, onChange }: Props) => {
  const [select, setSelect] = useState(value || list[0]?.value);
  const clickHandler = (v: any) => {
    setSelect(v);
    onChange?.(v);
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
          className={`h-8 min-w-[3rem] flex justify-center items-center px-6 text-sm ${
            select === item.value ? 'text-blue-500 underline decoration-1' : ' '
          }`}>
          {item.label}
        </div>
      ))}
    </div>
  );
};
