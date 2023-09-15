import { useState, useMemo, useEffect } from 'react';
import {
  Select as NextSelect,
  SelectSection,
  SelectItem,
} from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

interface Props {
  list: any[];
  keys?: Record<string, string>;
  className?: string;
  value?: any;
  disabled?: boolean;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  onChange?: ({ q, a }: any) => void;
}
export const Select = ({
  list = [],
  onChange,
  disabled,
  value,
  size,
  placeholder,
  keys = { label: 'label', value: 'value' },
}: Props) => {
  const { t } = useTranslation();
  placeholder = placeholder || t('common.select');
  console.log(list);
  const [selectValue, setValue] = useState<any>(new Set([value]));
  console.log(selectValue);
  const onSelectionChange = (data: any) => {
    const _v = Array.from(data)?.[0];
    console.log(_v);
    setValue(data);
    onChange && onChange(_v);
  };
  const disabledKeys = useMemo(() => {
    return list.filter((v) => v.disabled).map((v) => v[keys.value])
  }, [list]);
  console.log(disabledKeys)
  useEffect(() => {
    console.log(value)
    setValue(new Set([value]));
  }, [value]);

  return (
    <NextSelect
      // label='Favorite Animal'
      selectedKeys={selectValue}
      size={size}
      disabledKeys={disabledKeys}
      onSelectionChange={onSelectionChange}
      placeholder={placeholder}
      className='max-w-xs'
      isDisabled={disabled}>
      {list.map((v) => (
        <SelectItem key={v[keys.value]} value={v[keys.value]}>
          {v[keys.label]}
        </SelectItem>
      ))}
    </NextSelect>
  );
};
