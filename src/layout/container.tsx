import { useTheme } from '@nextui-org/react';
import { useEffect } from 'react';
export default function Container({ children }: any) {
  const { isDark } = useTheme();
  return (
    <div
      className={`${
        isDark ? 'sm:bg-coolGray-9' : 'sm:bg-coolGray-1'
      } rounded-xl sm:w-400px mx-auto h-full sm:h-800px`}>
      {children}
    </div>
  );
}
