import { RouteObject } from 'react-router-dom';
import SettingIndex from '@/pages/setting/index';
import SettingLanguage from '@/pages/setting/language';

export const ROUTE_PATH_SETTING = {
  SETTING_INDEX: '/setting',
  SETTING_LANGUAGE: '/setting/language',
};

export const settingRoutes: RouteObject[] = [
  {
    path: ROUTE_PATH_SETTING.SETTING_INDEX,
    element: <SettingIndex />,
  },
  {
    path: ROUTE_PATH_SETTING.SETTING_LANGUAGE,
    element: <SettingLanguage />,
  },
];
