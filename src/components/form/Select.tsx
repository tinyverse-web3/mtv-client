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
  onChange?: ({ q, a }: any) => void;
}
export const Select = ({
  list = [],
  onChange,
  disabled,
  value,
  placeholder,
  keys = { label: 'label', value: 'value' },
}: Props) => {
  const { t } = useTranslation();
  placeholder = placeholder || t('common.select');
  const [selected, setSelected] = useState(new Set([value]));

  const selectedValue = useMemo(() => Array.from(selected)[0], [selected]);
  const selectedLabel = useMemo(() => {
    const item = list.find((v) => v[keys.value] === selectedValue);
    return item?.[keys.label];
  }, [selectedValue]);
  const onSelectionChange = (data: any) => {
    console.log(data);
    setSelected(data);
  };
  useEffect(() => {
    onChange && onChange(selectedValue);
  }, [selectedValue]);

  return (
    <NextSelect
      // label='Favorite Animal'
      value={selectedValue}
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
