import { useGlobalStore } from '@/store';
import { useRequest } from '@/api';
import { useEffect } from 'react';

export const useUpdateLevel = () => {
  const { userLevel } = useGlobalStore((state) => state);
  console.log(userLevel);
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
    {
      onSuccess() {},
    },
  );

  const unsub = useGlobalStore.subscribe((state, prevState) => {
    if (state.userLevel > prevState.userLevel) {
      updateSafeLevel();
    }
  });
  useEffect(() => {
    return unsub;
  });
  console.log(useGlobalStore);
  return userLevel;
};
