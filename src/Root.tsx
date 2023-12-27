import { useRef, useEffect, useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { LaunchCheck } from '@/components/LaunchCheck';
import { useGlobalStore } from '@/store';
import { useRequest } from '@/api';
import { BindMail } from '@/components/BindMail';

export default function Root() {
  const loading = useGlobalStore((state) => state.checkLoading);
  return (
    <>
      <BindMail />
      <LaunchCheck>
      </LaunchCheck>
    </>
  );
}
