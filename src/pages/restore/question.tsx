import { useState } from 'react';
import { Text, Row, Button, Textarea } from '@nextui-org/react';
import { STATUS_CODE } from '@/lib/account/account';
import { useNavigate } from 'react-router-dom';
import {
  useQuestionStore,
  useAccountStore,
} from '@/store';
import toast from 'react-hot-toast';
import { QuestionRestore } from '@/pages/restore/components/QuestionRestore';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';

export default function Restore() {
  const { VITE_DEFAULT_PASSWORD } = import.meta.env;
  const nav = useNavigate();
  const { account } = useAccountStore((state) => state);
  const {
    list: questionList,
    sssData: serverShare,
    publicKey,
    type,
  } = useQuestionStore((state) => state);

  const questionSubmit = async (list: any[]) => {
    const status = await account.restoreByQuestions({
      questions: list,
      password: VITE_DEFAULT_PASSWORD,
      sssData: serverShare,
      publicKey,
    });
    console.log(status);
    if (status === STATUS_CODE.SUCCESS) {
      nav(ROUTE_PATH.SPACE_INDEX, { replace: true });
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
