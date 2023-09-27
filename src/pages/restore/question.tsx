import { useMemo, useState } from 'react';
import { Button } from '@/components/form/Button';
import { useNavigate } from 'react-router-dom';
import {
  useQuestionStore,
  useAccountStore,
  useGlobalStore,
  useRestoreStore,
} from '@/store';
import { QuestionRestore } from '@/pages/restore/components/QuestionRestore';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Restore() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { getLocalAccountInfo } = useAccountStore((state) => state);
  const { setLockStatus } = useGlobalStore((state) => state);
  const [type, setType] = useState(1); // 1 默认 2 自定义
  const { defaultQuestionList, customQuestionList } = useRestoreStore(
    (state) => state,
  );
  const tabs = [
    {
      label: t('common.default'),
      value: 1,
    },
    {
      label: t('common.custom'),
      value: 2,
    },
  ];
  const tabChange = (value: number) => {
    setType(value);
  };
  const { passwordPrivateData, textPrivateData, customPrivateData } =
    useRestoreStore((state) => state);
  const questionSubmit = async (list: any[]) => {
    const { code, msg } = await account.restoreByQuestions({
      list,
      type,
      passwordPrivateData,
      textPrivateData,
      CustomPrivateData: customPrivateData,
    });
    if (code === '000000') {
      await getLocalAccountInfo();
      nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
      toast.success(t('pages.restore.toast.restore_success'));
    } else {
      toast.error(msg);
    }
    setLockStatus(false);
  };
  const questionList = useMemo(() => {
    if (type === 1) {
      return defaultQuestionList;
    } else {
      return customQuestionList;
    }
  }, [type, customQuestionList, defaultQuestionList]);
  return (
    <LayoutThird title={t('pages.restore.question.title')}>
      <div className='p-6'>
        <div className='flex mb-4'>
          {tabs.map((item, index) => {
            return (
              <Button
                key={index}
                className={`w-20 mr-2 text-14px ${
                  type === item.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
                onClick={() => {
                  tabChange(item.value);
                }}>
                {item.label}
              </Button>
            );
          })}
        </div>
        <QuestionRestore
          type={type}
          questionList={questionList}
          onSubmit={questionSubmit}></QuestionRestore>
      </div>
    </LayoutThird>
  );
}
