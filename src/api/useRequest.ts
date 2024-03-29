import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import type { SWRConfiguration } from 'swr';
import { useGlobalStore } from '@/store';
import toast from 'react-hot-toast';
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
export function useRequest<T>(
  { url, arg = { method: 'get', auth: false } }: RequestOption,
  swrOptions?: SWRConfiguration,
) {
  const [res, setRes] = useState<T>();
  const logout = useGlobalStore((state) => state.logout);
  const customSuccess = swrOptions?.onSuccess;
  const customError = swrOptions?.onError;

  const onSuccess = async (data: any, key: string, config: any) => {
    if (data.code === '600000') {
      // await logout();
      // location.replace('/home');
      // apiRetryList.push(trigger);
    } else if (customSuccess) {
      await customSuccess(data, key, config);
    }
  };
  const onError = async (data: any, key: string, config: any) => {
    if (customError) {
      customError(data, key, config);
    } else {
      toast.error(JSON.stringify(data));
    }
  };
  const _swrConfig: any = { ...defaultSwrConfig, ...swrOptions };
  _swrConfig.onSuccess = onSuccess;
  _swrConfig.onError = onError;

  const fetcher = async ({ url, arg }: any) => {
    const { publicKey, address }: any = {};
    const headers: any = {};
    const _method = arg?.method.toUpperCase();
    const options: any = {
      method: _method,
      headers,
    };
    let _url = url;
    if (url.indexOf('http') > -1) {
      _url = url;
    }
    if (['POST', 'PUT', 'UPDATE'].includes(_method) && arg.query) {
      const strifyParsam = JSON.stringify(arg.query);
      options.body = strifyParsam;
    }
    if (arg?.query && _method === 'GET') {
      const query = Object.keys(arg.query)
        .map((key) => `${key}=${arg.query[key]}`)
        .join('&');
      _url = `${_url}?${query}`;
    }
    if (arg?.auth && publicKey) {
      const signStr = options.body || _url;
      // const sign = await wallet?.sign(signStr);
      // options.headers.public_key = publicKey;
      // options.headers.sign = sign;
      // options.headers.address = address;
    }
    
    _url = `${baseUrl}/${apiVersion}${_url}`;
    return fetch(_url, options).then((res) => res.json());
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
