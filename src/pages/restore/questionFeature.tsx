import { useEffect, useState } from 'react';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import { useNavigate } from 'react-router-dom';
import { useRestoreStore } from '@/store';
import { useKeyPressEvent } from 'react-use';
import LayoutThird from '@/layout/LayoutThird';
import { toast } from 'react-hot-toast';
import { ROUTE_PATH } from '@/router';
import account from '@/lib/account/account';
import { useTranslation } from 'react-i18next';

export default function QuestionFeature() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    setPasswordPrivateData,
    setTextPrivateData,
    setCustomPrivateData,
    setCustomQuestionList,
    setDefaultQuestionList,
    hasVault,
  } = useRestoreStore((state) => state);

  const verfyPrivate = async () => {
    const privateArr = [text, password, customText];
    const privateFilter = privateArr.filter((v) => !!v);
    if (privateFilter.length < 1) {
      toast.error(t('pages.account.encrypted_safe.toast.error_1'));
      setLoading(false);
      return;
    }
    if (text && text?.length < 8) {
      toast.error(t('pages.account.encrypted_safe.toast.error_2'));
      return;
    }
    if (password && password?.length < 8) {
      toast.error(t('pages.account.encrypted_safe.toast.error_3'));
      return;
    }
    if (customText && customText?.length < 8) {
      toast.error(t('pages.account.encrypted_safe.toast.error_4'));
      return;
    }
    await restore();
  };
  const restore = async () => {
    setLoading(true);

    try {
      const {
        code,
        msg,
        data: result,
      } = await account.getQuestions4Retrieve({
        textPrivateData: text,
        passwordPrivateData: password,
        CustomPrivateData: customText,
      });
      if (code !== '000000') {
        toast.error(msg);
        setLoading(false);
        return;
      }
      setPasswordPrivateData(text);
      setTextPrivateData(password);
      setCustomPrivateData(customText);
      const defaultList =
        result[0]?.map((v: any, i: number) => {
          return {
            id: i,
            title: v.Title,
            list: v.Content.map((s: any) => ({
              q: s.Content,
              a: '',
              l: Number(s.Characters),
            })),
            template: result[0]?.map((s: any) => ({
              q: s.Content,
            })),
            unselectList: [],
          };
        }) || [];

      const customList =
        result[1]?.map((v: any, i: number) => {
          return {
            id: i,
            title: v.Title,
            list: v.Content.map((s: any) => ({
              q: s.Content,
              a: '',
              l: Number(s.Characters),
            })),
            template: result[1]?.map((s: any) => ({
              q: s.Content,
            })),
            unselectList: [],
          };
        }) || [];
      setDefaultQuestionList(defaultList);
      setCustomQuestionList(customList);
      // await setList(_list);
      nav(ROUTE_PATH.RESTORE_QUESTION, { replace: hasVault });
    } catch (error) {
      console.error(error);
      toast.error(t('pages.account.encrypted_safe.feature_error'));
    }
    setLoading(false);
  };
  const pressHandler = async () => {
    await restore();
  };
  useKeyPressEvent('Enter', () => {
    if (text) {
      pressHandler();
    }
  });
  const onChange = (e: any) => {
    setText(e);
  };
  const onPasswordChange = (e: any) => {
    setPassword(e);
  };
  const onCustomChange = (e: any) => {
    setCustomText(e);
  };
  useEffect(() => {
    if (!hasVault) {
      restore();
    }
  }, [hasVault]);
  return (
    <LayoutThird title={t('pages.restore.encrypted_safe.title')}>
      <div className='pt-8 px-6'>
        {/* <div className='text-center mb-8'>请先恢复加密保险箱，在恢复账号</div> */}
        <Input
          clearable
          bordered
          fullWidth
          maxLength={20}
          value={text}
          className='h-50px mb-6'
          onChange={onChange}
          placeholder={t('pages.account.encrypted_safe.text')}
          initialValue=''
        />
        <Input
          clearable
          bordered
          fullWidth
          maxLength={20}
          value={password}
          className='h-50px mb-6'
          onChange={onPasswordChange}
          placeholder={t('pages.account.encrypted_safe.password')}
          initialValue=''
        />
        <Input
          clearable
          bordered
          fullWidth
          maxLength={20}
          value={customText}
          className='h-50px mb-6'
          onChange={onCustomChange}
          placeholder={t('pages.account.encrypted_safe.custom')}
          initialValue=''
        />
        <Button disabled={true} size='lg' className='mx-auto mb-6 w-full'>
          {t('common.fingerprint.title')}
        </Button>
        <Button
          disabled={!text && !password && !customText}
          size='lg'
          loading={loading}
          className='mx-auto w-full'
          onPress={verfyPrivate}>
          {t('common.confirm')}
        </Button>
      </div>
    </LayoutThird>
  );
}
