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
  const [resumeStatus, setResumeStatus] = useState(false);
  const {
    resume: resumeMtvStorage,
    mtvStorage,
    init: initMtvStorage,
  } = useMtvStorageStore((state) => state);
  const {
    list: questionList,
    sssData: serverShare,
    type,
  } = useQuestionStore((state) => state);
  const setWallet = useWalletStore((state) => state.setWallet);
  const { getLocalUserInfo } = useGlobalStore((state) => state);
  const restoreData = async (privateKey: string) => {
    if (privateKey) {
      if (!resumeStatus) {
        await initMtvStorage(privateKey);
      }
      await resumeMtvStorage();
      await getLocalUserInfo();
    }
  };
  const questionSubmit = async (shares: string[]) => {
    const status = await wallet.sssResotre(shares, VITE_DEFAULT_PASSWORD);
    if (status === STATUS_CODE.SUCCESS && wallet?.privateKey) {
      try {
        await restoreData(wallet?.privateKey);
        await setWallet(wallet);
        nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
      } catch (error: any) {
        if (error.toString().indexOf('resolve name') > -1) {
          toast.error('您未备份过数据，数据无法恢复！');
          nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
        } else {
          setResumeStatus(true);
          await wallet?.delete();
          toast.error('恢复数据失败，请重试！');
        }
      }
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
