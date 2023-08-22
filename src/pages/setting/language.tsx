import LayoutThird from '@/layout/LayoutThird';
import { useNavigate } from 'react-router-dom';
import { ListRow } from '@/components/ListRow';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
// import i18n from '@/locale';
export default function Language() {
  const nav = useNavigate();
  const { i18n } = useTranslation();
  const setLanguage =  async (l: string) => {
    console.log('toLanguage');
    await i18n.changeLanguage(l);
    toast.success('语言切换成功');
  };
  return (
    <LayoutThird showBack title='语言'>
      <div className='p-4'>
        <ListRow label='中文' onPress={() => setLanguage('zh-CN')}/>
        <ListRow label='English' onPress={() => setLanguage('en')}/>
      </div>
    </LayoutThird>
  );
}
