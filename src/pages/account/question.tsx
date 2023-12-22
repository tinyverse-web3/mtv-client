import { useEffect, useState } from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { QuestionMaintain } from '@/pages/account/components/QuestionMaintain';
import { useQuestionStore } from '@/store';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
export default function Question() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('default');
  const { setType, type } = useQuestionStore((state) => state);
  const tabs = [
    {
      label: t('common.default'),
      key: 'default',
      value: 1,
    },
    {
      label: t('common.custom'),
      key: 'custom',
      value: 2,
    },
  ];
  const tabChange = (key: any) => {
    console.log(key);
    setTab(key);
    // const { value } = tabs.find((v) => (v.key === key)) || {};
    // console.log(value);
    // if (value) {
    //   setType(value);
    // }
  };
  useEffect(() => {
    if (tab === 'default') {
      setType(1);
    } else {
      setType(2);
    }
  }, [tab]);
  return (
    <LayoutThird title={t('pages.account.question.backup')}>
      <div className='p-4'>
        <Tabs
          fullWidth
          size='md'
          aria-label='Tabs form'
          onSelectionChange={tabChange}
          className='mb-4'>
          {tabs.map((item) => (
            <Tab key={item.key} title={item.label}></Tab>
          ))}
        </Tabs>
        <div className='text-14px mb-6'>{t('pages.account.question.hint')}</div>
        <div>
          <QuestionMaintain />
        </div>
      </div>
    </LayoutThird>
  );
}
