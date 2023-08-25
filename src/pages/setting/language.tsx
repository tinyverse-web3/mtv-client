import LayoutThird from '@/layout/LayoutThird';
import { useNavigate } from 'react-router-dom';
import { ListRow } from '@/components/ListRow';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

// import i18n from '@/locale';
export default function Language() {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const setLanguage = async (l: string) => {
    await i18n.changeLanguage(l);
    toast.success(t('pages.account.setting.language.change_success'));
    if (window?.JsBridge) {
      window.JsBridge.setupLanguage(l);
    }
  };
  return (
    <LayoutThird showBack title={t('pages.account.setting.language.title')}>
      <div className='p-4'>
        <ListRow
          label='English'
          value={i18n.language === 'en' ? '√' : ''}
          onPress={() => setLanguage('en')}
        />
        <ListRow
          label='中文'
          value={i18n.language === 'zh-CN' ? '√' : ''}
          onPress={() => setLanguage('zh-CN')}
        />
      </div>
    </LayoutThird>
  );
}
