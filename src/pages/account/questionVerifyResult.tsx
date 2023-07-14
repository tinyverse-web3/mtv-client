import { useEffect, useMemo, useState } from 'react';
import { Image, Button } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { KeySha } from '@/lib/account';
import { useRequest } from '@/api';
import toast from 'react-hot-toast';
import { cloneDeep } from 'lodash';
import {
  useQuestionStore,
  useWalletStore,
  useGlobalStore,
  useAccountStore,
} from '@/store';

import imageSuccess from '@/assets/images/icon-success.png';
import imageError from '@/assets/images/icon-error.png';

export default function QuestionVerifyResult() {
  const nav = useNavigate();

  const { state } = useLocation();
  const { account } = useAccountStore((state) => state);
  const { list: initList, type } = useQuestionStore((state) => state);

  const toAccount = async () => {
    nav(ROUTE_PATH.ACCOUNT);
  };

  const onSubmit = async () => {
    console.log(initList);
    try {
      await account.backupByQuestion({ list: initList, type });
      toast.success('备份成功');
      toAccount();
    } catch (error) {
      console.log(error);
      toast.error('备份失败');
    }
  };

  useEffect(() => {
    if (!initList.length) {
      nav(ROUTE_PATH.ACCOUNT_QUESTION);
    }
  }, []);
  return (
    <LayoutThird title='智能隐私备份'>
      {state ? (
        <div className='px-6 pt-10'>
          <Image src={imageSuccess} className='w-40 mb-10' />
          <Button className='w-full' size='lg' onPress={onSubmit}>
            完成
          </Button>
        </div>
      ) : (
        <div className='px-6 pt-10'>
          <Image src={imageError} className='w-40 mb-10' />
          <Button className='w-full mb-6' size='lg' onPress={() => nav(-1)}>
            恢复测试
          </Button>
          <Button
            className='w-full'
            size='lg'
            onPress={() => nav(ROUTE_PATH.ACCOUNT_QUESTION)}>
            重新设置
          </Button>
        </div>
      )}
    </LayoutThird>
  );
}
