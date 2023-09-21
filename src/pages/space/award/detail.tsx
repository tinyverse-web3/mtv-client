import { Empty } from '@/components/Empty';
import LayoutThird from '@/layout/LayoutThird';
import { DetailItem } from './components/DetailItem';
import { useAwardStore } from '@/store';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
export default function AwardDetail() {
  const { t } = useTranslation();
  const { list } = useAwardStore((state) => state);
  const applyDailyReward = async () => {
    const { code, data, msg } = await account.applyDailyReward();
    if (code === '000000') {
      toast.success(t('pages.space.award.apply_success'));
    } else {
      toast.error(msg);
    }
  };
  const toDetail = () => {};
  return (
    <LayoutThird title={t('pages.space.award.title')}>
      <div className='p-4'>
        <div className='rounded-2xl bg-gray-100 px-2'>
          {list.map((item, i) => (
            <DetailItem key={i} item={item} bordered={i !== list.length - 1} />
          ))}
        </div>
        <div className='mt-60 hint-text-box'>{t('pages.space.award.hint')}</div>
      </div>
    </LayoutThird>
  );
}
