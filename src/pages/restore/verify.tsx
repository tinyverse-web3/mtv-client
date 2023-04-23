import { useState, useMemo } from 'react';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { EmailBox } from '@/components/form/EmailBox';
import { ROUTE_PATH } from '@/router';
import { useRequest } from '@/api';
import { useNavigate } from 'react-router-dom';
import { useQuestionStore } from '@/store';
import { toast } from 'react-hot-toast';
export default function AccountQuestion() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const { setEmail: setVerifyEmail, setList, setSssData } = useQuestionStore((state) => state);
  const emailChange = ({ email, code }: any) => {
    setEmail(email);
    setCode(code);
  };
  const { mutate: verifyBindEmail } = useRequest({
    url: '/user/verifymail',
    arg: {
      auth: true,
      method: 'post',
      query: { email, confirmCode: code },
    },
  });
  const submit = async () => {
    const { data, code } = await verifyBindEmail();
    if (code === '000000') {
      if (data?.questionSssData) {
        await setVerifyEmail(data.email);
        await setSssData(data.questionSssData);
        const _list = data.questions.map((v: any, i: number) => {
          const list = JSON.parse(v.content);
          return {
            id: i,
            list: list.map((s: any) => ({
              q: s.content,
              a: '',
              l: Number(s.characters),
            })),
            template: list.map((s: any) => ({
              q: s.content,
            })),
            unselectList: [],
          };
        });
        await setList(_list);
        nav(ROUTE_PATH.RESTORE_QUESTION);
      } else {
        toast.error('该邮箱未进行智能隐私备份');
      }
    }
    setLoading(false);
  };
  const disabled = useMemo(() => !(email && code), [email, code]);
  return (
    <LayoutThird title='添加守护者' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='p-4'>
        <div>
          <div className='mb-6'>
            <EmailBox onChange={emailChange} />
          </div>
          <Button
            disabled={disabled}
            size='lg'
            loading={loading}
            className='mx-auto mb-2 w-full'
            onPress={submit}>
            确定
          </Button>
        </div>
      </div>
    </LayoutThird>
  );
}
