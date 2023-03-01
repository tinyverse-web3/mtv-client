import { useTheme as useNextTheme } from 'next-themes';
import { Button, useTheme } from '@nextui-org/react';

export const ThemeSwitch = () => {
  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();
  const themeChange = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  return (
    <Button
      light
      size='sm'
      auto
      className="px-0 text-5"
      onPress={themeChange}>
      {isDark ? '☀️' : '🌛'}
    </Button>
  );
};
