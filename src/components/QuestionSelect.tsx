import { useState, useMemo, useEffect } from 'react';
import { Dropdown, Input } from '@nextui-org/react';
import toast from 'react-hot-toast';

interface Props {
  list: any[];
  className?: string;
  select?: any;
  onChange?: ({ q, a }: any) => void;
}
export const QuestionSelect = ({
  list = [],
  className,
  onChange,
  select,
}: Props) => {
  const [selected, setSelected] = useState(new Set([select.q]));
  const [answer, setAnswer] = useState(select.a);
  const selectedValue = useMemo(
    () => Array.from(selected).join(', ').replaceAll('_', ' '),
    [selected],
  );
  const onSelectionChange = (data: any) => {
    setAnswer('');
    setSelected(data);
  };
  const inputChange = (e: any) => {
    setAnswer(e.target.value);
  };
  useEffect(() => {
    onChange && onChange({ q: selectedValue, a: answer });
  }, [selectedValue, answer]);
  return (
    <div className={className}>
      <Dropdown>
        <Dropdown.Button color='secondary' className='w-full mb-4'>
          {selectedValue || '请选择一个问题'}
        </Dropdown.Button>
        <Dropdown.Menu
          aria-label='Single selection actions'
          disallowEmptySelection
          selectionMode='single'
          selectedKeys={selected}
          onSelectionChange={onSelectionChange}>
          {list.map((v) => (
            <Dropdown.Item key={v.q} textValue={v.q}>
              {v.q}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <Input
        aria-label='text'
        fullWidth
        clearable
        disabled={!selectedValue}
        placeholder='请输入答案'
        bordered
        value={answer}
        onChange={inputChange}
      />
    </div>
  );
};
