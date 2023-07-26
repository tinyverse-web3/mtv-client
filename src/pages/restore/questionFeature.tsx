import { useState } from 'react';
import { Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useNavigate } from 'react-router-dom';
import { useRestoreStore, useQuestionStore } from '@/store';
import { useKeyPressEvent } from 'react-use';
import LayoutThird from '@/layout/LayoutThird';
import { toast } from 'react-hot-toast';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';

export default function QuestionFeature() {
  const nav = useNavigate();
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);
  const { setPublicKey, setList, setSssData, setType } = useQuestionStore(
    (state) => state,
  );
  const { setPasswordPrivateData, setTextPrivateData } = useRestoreStore((state) => state);
  const add = async () => {
    setLoading(true);
    const privateArr = [text, password, customText];
    const privateFilter = privateArr.filter((v) => !!v);
    if (privateFilter.length < 2) {
      toast.error('请至少输入两种内容');
      setLoading(false);
      return;
    }
    try {
      const { code, msg, data: result } = await account.getQuestions4Retrieve({
        textPrivateData: text,
        passwordPrivateData: password,
      });
      if (code !== '000000') {
        toast.error(msg);
        setLoading(false);
        return;
      }
      setPasswordPrivateData(password);
      setTextPrivateData(password);
      const questionType = result[0].Type;
      setType(questionType);
      const _list = result.map((v: any, i: number) => {
        return {
          id: i,
          title: v.Title,
          list: v.Content.map((s: any) => ({
            q: s.Content,
            a: '',
            l: Number(s.Characters),
          })),
          template: result.map((s: any) => ({
            q: s.Content,
          })),
          unselectList: [],
        };
      });
      await setList(_list);
      nav(ROUTE_PATH.RESTORE_QUESTION);
    } catch (error) {
      toast.error('特征数据错误');
    }
    setLoading(false);
  };
  const pressHandler = async () => {
    await add();
  };
  useKeyPressEvent('Enter', () => {
    if (text) {
      pressHandler();
    }
  });
  const onChange = (e: any) => {
    setText(e.target.value?.trim());
  };
  const onPasswordChange = (e: any) => {
    setPassword(e.target.value?.trim());
  };
  const onCustomChange = (e: any) => {
    setCustomText(e.target.value?.trim());
  };
  return (
    <LayoutThird title='恢复加密保险箱'>
      <div className='pt-8 px-6'>
        <div className='text-center mb-8'>请先恢复加密保险箱，在恢复账号</div>
        <Input
          clearable
          bordered
          fullWidth
          maxLength={20}
          type='number'
          value={text}
          className='h-50px mb-6'
          onChange={onChange}
          placeholder='输入口令'
          initialValue=''
        />
        <Input
          clearable
          bordered
          fullWidth
          maxLength={20}
          type='number'
          value={password}
          className='h-50px mb-6'
          onChange={onPasswordChange}
          placeholder='常用口令'
          initialValue=''
        />
        <Input
          clearable
          bordered
          fullWidth
          maxLength={20}
          type='number'
          value={customText}
          className='h-50px mb-6'
          onChange={onCustomChange}
          placeholder='自定义特征数据'
          initialValue=''
        />
        <Button
          disabled={true}
          size='lg'
          loading={loading}
          className='mx-auto mb-6 w-full'
          onPress={add}>
          指纹
        </Button>
        <Button
          disabled={!text && !password && !customText}
          size='lg'
          loading={loading}
          className='mx-auto w-full'
          onPress={add}>
          确认
        </Button>
      </div>
    </LayoutThird>
  );
}
