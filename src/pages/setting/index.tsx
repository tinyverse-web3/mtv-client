import LayoutThird from '@/layout/LayoutThird';
import { useNavigate } from 'react-router-dom';
import { ListRow } from '@/components/ListRow';
import { ROUTE_PATH } from '@/router';

export default function Setting() {
  const nav = useNavigate();
  const toLanguage = () => {
    nav(ROUTE_PATH.SETTING_LANGUAGE);
  };
  return (
    <LayoutThird showBack title='设置'>
      <div className='p-4'>
        <ListRow label='语言' onPress={toLanguage} />
      </div>
    </LayoutThird>
  );
}
