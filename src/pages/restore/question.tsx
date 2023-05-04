import { useState } from 'react';
import { Text, Row, Button, Textarea } from '@nextui-org/react';
import wallet, { STATUS_CODE } from '@/lib/account/wallet';
import { useNavigate } from 'react-router-dom';
import {
  useWalletStore,
  useGlobalStore,
  useMtvStorageStore,
  useQuestionStore,
} from '@/store';
import { useRequest } from '@/api';
import toast from 'react-hot-toast';
import { QuestionRestore } from '@/pages/restore/components/QuestionRestore';
import { VerifyMail } from '@/components/VerifyMail';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
export default function Restore() {
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const nav = useNavigate();
  const { resume: resumeMtvStorage, mtvStorage } = useMtvStorageStore(
    (state) => state,
  );
  const {
    list: questionList,
    sssData: serverShare,
    type,
  } = useQuestionStore((state) => state);
  const setWallet = useWalletStore((state) => state.setWallet);
  const { setUserInfo } = useGlobalStore((state) => state);
  const getStorageUserInfo = async () => {
    const userInfo = await mtvStorage?.get('userInfo');
    if (userInfo) {
      await setUserInfo(userInfo);
    }
  };
  const { mutate: getuserinfo } = useRequest(
    {
      url: '/user/getuserinfo',
      arg: { method: 'get', auth: true },
    },
    {
      onSuccess: async (res) => {
        const { name, email, safeLevel } = res.data;
        setUserInfo({ bindStatus: true, maintainQuestion: true });
        setUserInfo({ email, nickname: name, maintainQuestion: true });
        const { privateKey } = wallet || {};
        if (privateKey) {
          await resumeMtvStorage(privateKey);
          await getStorageUserInfo();
        }
        nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
      },
    },
  );

  const questionSubmit = async (shares: string[]) => {
    const status = await wallet.sssResotre(shares, VITE_DEFAULT_PASSWORD);
    if (status === STATUS_CODE.SUCCESS) {
      await setWallet(wallet);
      await getuserinfo();
    } else if (status === STATUS_CODE.SHARES_ERROR) {
      toast.error('分片数据错误');
    }
  };
  return (
    <LayoutThird title='智能隐私恢复'>
      <div className='p-6'>
        <QuestionRestore
          type={type}
          serverShare={serverShare}
          questionList={questionList}
          onSubmit={questionSubmit}></QuestionRestore>
      </div>
    </LayoutThird>
  );
}
