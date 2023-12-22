import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';

export const LanguageIcon = () => {
  const nav = useNavigate();
  const toSetting = () => {
    nav(ROUTE_PATH.SETTING_INDEX);
  };
  return (
    <div
      className='i-material-symbols-settings w-6 h-6 text-blue-9 '
      onClick={toSetting}></div>
  );
};
