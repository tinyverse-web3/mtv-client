import LayoutThird from '@/layout/LayoutThird';
import { useNavigate } from 'react-router-dom';
import { ListRow } from '@/components/ListRow';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';

export default function Setting() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const toLanguage = () => {
    nav(ROUTE_PATH.SETTING_LANGUAGE);
  };
  return (
    <LayoutThird showBack title={t('pages.account.setting.title')}>
      <div className='p-4'>
        <ListRow
          label={t('pages.account.setting.language.title')}
          onPress={toLanguage}
        />
      </div>
    </LayoutThird>
  );
}
