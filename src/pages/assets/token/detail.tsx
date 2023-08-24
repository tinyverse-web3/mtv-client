import LayoutThird from '@/layout/LayoutThird';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWalletBalance, usePoint } from '@/lib/hooks';
import { AssetsTokenItem } from '../components/AssetsTokenItem';
import { useTranslation } from 'react-i18next';

export default function TokenDetail() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { balance: pointBalance } = usePoint();
  return (
    <LayoutThird title='代币详情'>
      <div className='px-4'>
        <AssetsTokenItem
          icon='/logo.png'
          symbol={t('pages.assets.token.point_name')}
          key='point'
          balance={pointBalance}
        />
      </div>
      <div className='p-4'>

      </div>
    </LayoutThird>
  );
}
