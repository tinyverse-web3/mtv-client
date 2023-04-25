import { useState, useMemo, useEffect } from 'react';
import { Card, Text } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { KeySha } from '@/lib/account';
import { useRequest } from '@/api';
import { useWalletStore, useGlobalStore, useQuestionStore } from '@/store';
import { useCopyToClipboard } from 'react-use';
import toast from 'react-hot-toast';
import { Question } from '@/components/form/Question';
import { QuestionDefault } from '@/components/form/QuestionDefault';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { cloneDeep } from 'lodash';
interface Props {
  type: Number;
}
export const QuestionMaintain = ({ type }: Props) => {
  const nav = useNavigate();
  const { setList: setQuestionList, setType } = useQuestionStore(
    (state) => state,
  );

  const onSubmit = async (_list: any[]) => {
    // let list = _list.map((v, i) => {
    //   return {
    //     id: i,
    //     list: v.list
    //       .filter((s: any) => s.a),
    //     title: v.title,
    //   };
    // });
    // list = list.filter((v) => v.list.length);
    const list = cloneDeep(_list);
    setQuestionList(list.map((v) => ({ list: v.list, title: v.title })));
    nav(ROUTE_PATH.ACCOUNT_QUESTION_VERIFY);
  };
  return (
    <>
      {type == 1 ? (
        <QuestionDefault
          type='maintain'
          buttonText='恢复测试'
          onSubmit={onSubmit}
        />
      ) : (
        <Question
          type='maintain'
          buttonText='恢复测试'
          onSubmit={onSubmit}></Question>
      )}
    </>
  );
};
