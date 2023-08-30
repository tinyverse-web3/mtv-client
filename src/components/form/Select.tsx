import { useState, useMemo, useEffect } from 'react';
import { Dropdown, Text } from '@nextui-org/react';
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
  const { t} = useTranslation()
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
    <Dropdown isDisabled={disabled}>
      <Dropdown.Button
        color='secondary'
        className='w-full mb-4 max-w-full min-w-full overflow-hidden dropdown-button'>
        <div className='text-ellipsis overflow-hidden max-w-200px'>
          {selectedLabel || placeholder}
        </div>
      </Dropdown.Button>
      <Dropdown.Menu
        aria-label='Single selection actions'
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={selected}
        onSelectionChange={onSelectionChange}>
        {list.map((v, i) => (
          <Dropdown.Item
            className='text-11px h-auto py-2'
            key={v[keys.value]}
            textValue={v[keys.value]}>
            {v[keys.label]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
