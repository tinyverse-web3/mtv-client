import { useGlobalStore } from '@/store';
import { useRequest } from '@/api';
import { useEffect, useRef } from 'react';

export const useUpdateLevel = () => {
  const { userLevel } = useGlobalStore((state) => state);
  const prevLevel = useRef(userLevel);
  const { mutate: updateSafeLevel, loading: loading } = useRequest(
    {
      url: '/user/updatesafelevel',
      arg: {
        method: 'post',
        auth: true,
        query: {
          safeLevel: userLevel,
        },
      },
    },
  );

  useEffect(() => {
    if (prevLevel.current <= userLevel) {
      updateSafeLevel();
      prevLevel.current = userLevel;
    }
  }, [userLevel]);
  return userLevel;
};
