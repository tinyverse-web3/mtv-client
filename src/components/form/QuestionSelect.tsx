import { useState, useMemo, useEffect } from 'react';
import { Button} from '@/components/form/Button';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem
} from "@nextui-org/react";
import { Icon } from '@iconify/react'
import { Textarea } from '@/components/form/Textarea';
import { Input } from '@/components/form/Input';
import { useTranslation } from 'react-i18next';

interface Props {
  list: any[];
  index: number;
  className?: string;
  select?: any;
  disabled?: boolean;
  onChange?: ({ q, a }: any) => void;
  onRemove?: () => void;
}

export const QuestionSelect = ({
  list = [],
  index,
  className,
  onChange,
  disabled,
  select,
  onRemove,
}: Props) => {
  const { t } = useTranslation();
  const CUSTOM_QUESTION = t('common.custom');
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
    setAnswer(e?.trim());
    if (!disabled) {
      setAnswerLen(e.length);
    }
  };
  const questionChange = (e: any) => {
    console.log(e)
    setCustomQuestion(e?.trim());
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
  const RendText = ({ num }: any) => {
    return (
      disabled &&
      num && (
        <div className='break-keep text-xs'>
          {num}
          {t('pages.account.question.toast.error_3_end')}
        </div>
      )
    );
  };
  return (
    <div className={className}>
      <div className='flex items-center mb-4'>
        <div className='w-5 min-h-5 rounded-full border border-gray-300 border-solid mr-1 flex items-center justify-center text-xs'>
          {index + 1}
        </div>
        <div className='flex-1'>
          <Dropdown isDisabled={disabled}>
            <DropdownTrigger
              className='w-full  max-w-full min-w-full overflow-hidden dropdown-button'>
              <div className='text-ellipsis overflow-hidden max-w-200px'>
                {selectedValue ||
                  t('pages.account.question.input.placeholder_select')}
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label='Single selection actions'
              disallowEmptySelection
              selectionMode='single'
              selectedKeys={selected}
              onSelectionChange={onSelectionChange}>
              {qList.map((v, i) => (
                <DropdownItem
                  className='text-11px h-auto py-2'
                  key={v.q}
                  textValue={v.q}>
                  {v.q}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        <Button
          light
          size='sm'
          auto
          disabled={disabled}
          className='px-2 text-4'
          onPress={onRemove}>
          <Icon icon='mdi:close'/>
        </Button>
      </div>
      {selectedValue && (
        <div className='mb-8'>
          <Textarea
            maxLength={40}
            minRows={1}
            placeholder={t('pages.account.question.input.placeholder')}
            helperText={
              answerLen
                ? `${t(
                    'pages.account.question.toast.error_3_first',
                  )}${answerLen}${t(
                    'pages.account.question.toast.error_3_end',
                  )}`
                : undefined
            }
            value={customQuestion}
            onChange={(e: any) => questionChange(e)}
          />
        </div>
      )}
      <Input
        clearable
        maxLength={30}
        readOnly={answerDisabled}
        placeholder={t('pages.account.question.input.placeholder_answer')}
        labelRight={<RendText num={answer.length} />}
        value={answer}
        onChange={inputChange}
      />
    </div>
  );
};
