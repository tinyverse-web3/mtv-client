import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { QuestionMaintain } from '@/pages/account/components/QuestionMaintain';
import { useQuestionStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
export default function Question() {
  const { t } = useTranslation();
  const { setType, type } = useQuestionStore((state) => state);
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
  return (
    <LayoutThird title={t('pages.account.question.backup')}>
      <div className='p-4'>
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
                auto
                onClick={() => {
                  tabChange(item.value);
                }}>
                {item.label}
              </Button>
            );
          })}
        </div>
        <div className='text-14px mb-6'>
          {t('pages.account.question.hint')}
        </div>
        <div>
          <QuestionMaintain type={type} />
        </div>
      </div>
    </LayoutThird>
  );
}
