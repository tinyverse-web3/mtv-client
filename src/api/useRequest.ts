import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
// import useSWRMutation from 'swr/mutation';
import type { SWRConfiguration } from 'swr';
import { useGlobalStore } from '@/store';
// import { ROUTE_PATH } from '@/router';

interface RequestOption {
  path: string;
  method?: string;
  auth?: boolean;
  query?: Record<string, any>;
}

const baseUrl = import.meta.env.VITE_API_HOST;
const apiVersion = import.meta.env.VITE_API_VERSION;
const defaultSwrConfig: SWRConfiguration = {
  revalidateOnReconnect: false,
  revalidateOnMount: false,
  revalidateOnFocus: false,
  shouldRetryOnError: false,
  revalidateIfStale: false,
};

export let apiRetryList: any[] = [];
export const clearRetryList = () => {
  apiRetryList = [];
};
// useGlobalStore.subscribe((state, prevState) => {
//   if (state.isLogin) {
//     for (let i = 0; i < apiRetryList.length; i++) {
//       const fn = apiRetryList.pop();
//       fn();
//     }
//   }
// });
export function useRequest<T>(
  { path, method = 'get', auth = false, query }: RequestOption,
  swrOptions?: SWRConfiguration,
) {
  const [res, setRes] = useState<T>();
  const logout = useGlobalStore((state) => state.logout);
  const token = useGlobalStore((state) => state.token);
  const customSuccess = swrOptions?.onSuccess;

  const onSuccess = async (data: any, key: string, config: any) => {
    if (data.code === '400000') {
      await logout();
      // nav(ROUTE_PATH.HOME);
      location.replace('/home')
      // apiRetryList.push(trigger);
    } else if (customSuccess) {
      await customSuccess(data, key, config);
    }
  };
  const _swrConfig: any = { ...defaultSwrConfig, ...swrOptions };
  _swrConfig.onSuccess = onSuccess;
  const _method = method.toUpperCase();

  const headers: any = {};
  if (auth) {
    headers.Authorization = `Bearer ${useGlobalStore.getState().token}`;
  }
  const options = useRef<any>({
    method: _method,
    headers,
  });

  useEffect(() => {
    if (['POST', 'PUT', 'UPDATE'].includes(_method)) {
      options.current.body = JSON.stringify(query);
    }
  }, [query]);
  useEffect(() => {
    if (auth && token) {
      options.current.headers.Authorization = `Bearer ${
        useGlobalStore.getState().token
      }`;
    }
  }, [auth, token]);
  const {
    data,
    error,
    mutate: trigger,
  } = useSWR(
    path,
    (url) => {
      return fetch(`${baseUrl}/${apiVersion}${url}`, options.current).then(
        (res) => res.json(),
      );
    },
    _swrConfig,
  );
  useEffect(() => {
    if (data?.code === '000000') {
      setRes(data?.data);
    }
  }, [data]);
  return { data: res, error, trigger };
}
