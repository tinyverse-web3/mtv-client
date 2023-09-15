import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/form/Button';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from '@nextui-org/react';
import { Select } from './Select';
import { Icon } from '@iconify/react';
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
  console.log(select);
  const CUSTOM_QUESTION = t('common.custom');
  const [selectedValue, setSelected] = useState(select.q);
  console.log(selectedValue);
  // const [selected, setSelectedValue] = useState(new Set([select.q]));
  const [answer, setAnswer] = useState(select.a);
  const [answerLen, setAnswerLen] = useState(select.l);
  const [customQuestion, setCustomQuestion] = useState(select.q);
  const [customStatus, setCustomStatus] = useState(false);
  // const selectedValue = useMemo(
  //   () => Array.from(selected).join(', ').replaceAll('_', ' '),
  //   [selected],
  // );
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
    console.log(e);
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
  const onSelectHandler = (value: any) => {
    console.log(value);
    setAnswer('');
    setSelected(value);
    console.log(CUSTOM_QUESTION);
    if (value === CUSTOM_QUESTION) {
      setCustomQuestion('');
    } else {
      setCustomQuestion(value);
    }
    setCustomStatus(true);
  };
  console.log(qList);
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
        {!disabled ? 
          <>
            <div className='flex-1'>
              <Select
                list={qList}
                size='sm'
                disabled={disabled}
                value={selectedValue}
                keys={{ label: 'q', value: 'q' }}
                placeholder={t(
                  'pages.account.question.input.placeholder_select',
                )}
                onChange={onSelectHandler}></Select>
            </div>
            <Button
              variant='light'
              size='sm'
              disabled={disabled}
              className='px-2 text-xl'
              onPress={onRemove}>
              <Icon icon='mdi:close' />
            </Button>
          </>:<Textarea
            maxLength={40}
            minRows={1}
            disabled={disabled}
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
        }
      </div>
      {!disabled && selectedValue && (
        <div className='mb-8'>
          <Textarea
            maxLength={40}
            minRows={1}
            disabled={disabled}
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
