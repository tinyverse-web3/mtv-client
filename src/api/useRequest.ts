import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import type { SWRConfiguration } from 'swr';
import { useGlobalStore, useWalletStore } from '@/store';
import { signMessage } from '@/lib/utils';
// import { ROUTE_PATH } from '@/router';

interface RequestOption {
  url: string;
  arg?: { auth?: boolean; method?: string; query?: Record<string, any> };
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
  { url, arg = { method: 'get', auth: false } }: RequestOption,
  swrOptions?: SWRConfiguration,
) {
  const [res, setRes] = useState<T>();
  const logout = useGlobalStore((state) => state.logout);
  const wallet = useWalletStore((state) => state.wallet);
  // const token = useGlobalStore((state) => state.token);
  const customSuccess = swrOptions?.onSuccess;

  const onSuccess = async (data: any, key: string, config: any) => {
    if (data.code === '600000') {
      // await logout();
      // location.replace('/home');
      // apiRetryList.push(trigger);
    } else if (customSuccess) {
      await customSuccess(data, key, config);
    }
  };
  const _swrConfig: any = { ...defaultSwrConfig, ...swrOptions };
  _swrConfig.onSuccess = onSuccess;

  const fetcher = async ({ url, arg }: any) => {
    console.log(url, arg);
    const headers: any = {};
    const _method = arg?.method.toUpperCase();
    const { publicKey, privateKey, address } = wallet?.wallet || {};
    const options: any = {
      method: _method,
      headers,
    };
    if (['POST', 'PUT', 'UPDATE'].includes(_method) && arg.query) {
      const strifyParsam = JSON.stringify(arg.query);
      options.body = strifyParsam;
    }
    if (arg?.auth && privateKey && address) {
      headers.Authorization = `Bearer ${useGlobalStore.getState().token}`;
      const sign = await signMessage(options.body || url, {
        address,
        privateKey,
      });
      options.headers.public_key = publicKey;
      options.headers.sign = sign;
      options.headers.address = address;
    }
    return fetch(`${baseUrl}/${apiVersion}${url}`, options).then((res) =>
      res.json(),
    );
  };
  const { data, error, trigger, isMutating } = useSWRMutation(
    { url, arg },
    fetcher,
    _swrConfig,
  );
  useEffect(() => {
    if (data?.code === '000000') {
      setRes(data?.data);
    }
  }, [data]);
  return { data: res, error, mutate: trigger, key: url, loading: isMutating };
}
