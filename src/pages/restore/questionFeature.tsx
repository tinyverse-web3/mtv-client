import { useState } from 'react';
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
  // const { setList, setType, type = 1 } = useRestoreStore(
  //   (state) => state,
  // );
  const {
    setPasswordPrivateData,
    setTextPrivateData,
    setCustomPrivateData,
    setCustomQuestionList,
    setDefaultQuestionList,
  } = useRestoreStore((state) => state);

  const add = async () => {
    setLoading(true);
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

      console.log(result[1]);
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
      nav(ROUTE_PATH.RESTORE_QUESTION);
    } catch (error) {
      console.error(error);
      toast.error(t('pages.account.encrypted_safe.feature_error'));
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
    setText(e?.trim());
  };
  const onPasswordChange = (e: any) => {
    setPassword(e?.trim());
  };
  const onCustomChange = (e: any) => {
    setCustomText(e?.trim());
  };
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
        <Button
          disabled={true}
          size='lg'
          loading={loading}
          className='mx-auto mb-6 w-full'
          onPress={add}>
          {t('common.fingerprint.title')}
        </Button>
        <Button
          disabled={!text && !password && !customText}
          size='lg'
          loading={loading}
          className='mx-auto w-full'
          onPress={add}>
          {t('common.confirm')}
        </Button>
      </div>
    </LayoutThird>
  );
}
