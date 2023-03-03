import { useState, useMemo, useEffect } from 'react';
import { Dropdown, Input } from '@nextui-org/react';
import toast from 'react-hot-toast';

interface Props {
  list: any[];
  templeteList: any[];
  className?: string;
  select?: any;
  disabled?: boolean;
  onChange?: ({ q, a }: any) => void;
}
const CUSTOM_QUESTION = '自定义';
export const QuestionSelect = ({
  list = [],
  templeteList = [],
  className,
  onChange,
  disabled,
  select,
}: Props) => {
  const [selected, setSelected] = useState(new Set([select.q]));
  const [answer, setAnswer] = useState(select.a);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customStatus, setCustomStatus] = useState(false);
  const selectedValue = useMemo(
    () => Array.from(selected).join(', ').replaceAll('_', ' '),
    [selected],
  );
  const onSelectionChange = (data: any) => {
    setAnswer('');
    setSelected(data);
    setCustomQuestion('');
    setCustomStatus(data.has(CUSTOM_QUESTION));
  };
  const inputChange = (e: any) => {
    setAnswer(e.target.value);
  };
  const qList = useMemo<any[]>(() => {
    return [...list, { q: CUSTOM_QUESTION, a: '' }];
  }, [list]);
  const answerDisabled = useMemo<boolean>(() => {
    let bol = true;
    if (customStatus && customQuestion) {
      bol = false;
    } else if (selectedValue && !customStatus) {
      bol = false;
    }
    return bol;
  }, [customStatus, customQuestion, selectedValue]);
  useEffect(() => {
    const data: any = {
      q: selectedValue,
      a: answer,
    };
    if (customStatus) {
      data.q = customQuestion;
    }
    onChange && onChange(data);
  }, [selectedValue, answer]);

  useEffect(() => {
    const isCustom = !templeteList?.find((v) => v.q === select.q);
    if (isCustom) {
      setSelected(new Set([CUSTOM_QUESTION]));
      setCustomQuestion(select.q);
    }
    setCustomStatus(isCustom);
  }, [templeteList, select]);
  return (
    <div className={className}>
      <Dropdown isDisabled={disabled}>
        <Dropdown.Button color='secondary' className='w-full mb-4'>
          {selectedValue || '请选择一个问题'}
        </Dropdown.Button>
        <Dropdown.Menu
          aria-label='Single selection actions'
          disallowEmptySelection
          selectionMode='single'
          selectedKeys={selected}
          onSelectionChange={onSelectionChange}>
          {qList.map((v, i) => (
            <Dropdown.Item key={v.q} textValue={v.q}>
              {v.q}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {customStatus && (
        <Input
          aria-label='text'
          fullWidth
          clearable
          maxLength={30}
          className='mb-4'
          disabled={!selectedValue || disabled}
          placeholder='请输入问题'
          bordered
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
        />
      )}
      <Input
        aria-label='text'
        fullWidth
        clearable
        maxLength={30}
        disabled={answerDisabled}
        placeholder='请输入答案'
        bordered
        value={answer}
        onChange={inputChange}
      />
    </div>
  );
};
