import { Empty } from '@/components/Empty';
import LayoutThird from '@/layout/LayoutThird';
import { DetailItem } from './components/DetailItem';
import { useAwardStore } from '@/store';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
export default function AwardDetail() {
  const { t } = useTranslation();
  const { list, getRewardList } = useAwardStore((state) => state);
  console.log(list);
  useEffect(() => {
    getRewardList();
  }, []);
  return (
    <LayoutThird title={t('pages.space.award.detail.title')}>
      <div className='p-4'>
      {!list.length && <Empty className='pt-32'/>}
        <div className='rounded-2xl bg-gray-100 px-2'>
          {list?.map((item, i) => (
            <DetailItem key={i} item={item} bordered={i !== list.length - 1} />
          ))}
        </div>
        <div className='mt-60 hint-text-box'>{t('pages.space.award.hint')}</div>
      </div>
    </LayoutThird>
  );
}
