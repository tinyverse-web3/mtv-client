import { useTheme as useNextTheme } from 'next-themes';
import { Button } from '@nextui-org/react';

export const ThemeSwitch = () => {
  const { setTheme } = useNextTheme();
  // const { isDark } = useTheme();
  const themeChange = () => {
    // setTheme(isDark ? 'light' : 'dark');
  };
  return (
    <Button
      variant='light'
      size='sm'
      className='px-1.5 text-5'
      onPress={themeChange}>
      {/* {isDark ? '☀️' : '🌛'} */}
    </Button>
  );
};
