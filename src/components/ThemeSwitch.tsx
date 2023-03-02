import { useTheme as useNextTheme } from 'next-themes';
import { Button, useTheme } from '@nextui-org/react';

export const ThemeSwitch = () => {
  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();
  const themeChange = () => {
    console.log(isDark)
    setTheme(isDark ? 'light' : 'dark');
  };
  return (
    <Button
      light
      size='sm'
      auto
      className="px-3 text-5"
      onPress={themeChange}>
      {isDark ? '☀️' : '🌛'}
    </Button>
  );
};
