import { useState, useMemo, useEffect } from 'react';
import { Dropdown, Text } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { Textarea } from '@/components/form/Textarea';
import { Input } from '@/components/form/Input';

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
  const [answerLen, setAnswerLen] = useState(select.l);
  const [customQuestion, setCustomQuestion] = useState(select.q);
  const [customStatus, setCustomStatus] = useState(false);
  const selectedValue = useMemo(
    () => Array.from(selected).join(', ').replaceAll('_', ' '),
    [selected],
  );
  const onSelectionChange = (data: any) => {
    setAnswer('');
    setSelected(data);
    if (data.has(CUSTOM_QUESTION)) {
      setCustomQuestion('');
    } else {
      console.log(Array.from(data).join(', ').replaceAll('_', ' '));
      setCustomQuestion(Array.from(data).join(', ').replaceAll('_', ' '));
    }
    setCustomStatus(true);
  };
  const inputChange = (e: any) => {
    setAnswer(e);
    setAnswerLen(e.length);
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
      q: customQuestion,
      a: answer,
      l: answerLen,
    };
    onChange && onChange(data);
  }, [selectedValue, answer, customQuestion]);

  useEffect(() => {
    const isCustom = !templeteList?.find((v) => v.q === select.q);
    // if (isCustom) {
    //   setSelected(new Set([CUSTOM_QUESTION]));
    //   setCustomQuestion(select.q);
    // }
    // setCustomStatus(isCustom);
    // setCustomQuestion(select.q);
  }, [templeteList, select]);

  const RendText = ({ num }: any) => {
    return num && <Text className='break-keep text-12px'>{num}个字符</Text>;
  };
  return (
    <div className={className}>
      <Dropdown isDisabled={disabled}>
        <Dropdown.Button
          color='secondary'
          className='w-full mb-4 max-w-full min-w-full overflow-hidden dropdown-button'>
          <div className='text-ellipsis overflow-hidden max-w-200px'>
            {selectedValue || '请选择一个问题'}
          </div>
        </Dropdown.Button>
        <Dropdown.Menu
          aria-label='Single selection actions'
          disallowEmptySelection
          selectionMode='single'
          selectedKeys={selected}
          onSelectionChange={onSelectionChange}>
          {qList.map((v, i) => (
            <Dropdown.Item className='text-12px' key={v.q} textValue={v.q}>
              {v.q}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {selectedValue && (
        <div className='mb-8'>
          <Textarea
            clearable={!disabled}
            maxLength={30}
            minRows={1}
            disabled={!selectedValue || disabled}
            placeholder='请输入问题'
            helperText={`答案共${answerLen}个字符`}
            value={customQuestion}
            onChange={(e: any) => setCustomQuestion(e)}
          />
        </div>
      )}
      <Input
        clearable
        maxLength={30}
        disabled={answerDisabled}
        placeholder='请输入答案'
        value={answer}
        onChange={inputChange}
      />
    </div>
  );
};
