import { useState, useMemo } from 'react';
import { Checkbox } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { EmailBox } from '@/components/form/EmailBox';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import account from '@/lib/account/account';
import { useAccountStore, useGlobalStore } from '@/store';
import { OauthThird } from '@/components/OauthThird';
import { useTranslation } from 'react-i18next';
export default function ProtectorAdd() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getLocalAccountInfo, accountInfo } = useAccountStore(
    (state) => state,
  );
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const emailChange = ({ email, code }: any) => {
    setEmail(email);
    setCode(code);
  };
  const checkboxChange = (e: boolean) => {
    setChecked(e);
  };
  const oauthGoogle = async (Code: string) => {
    const { code, msg } = await account.oauthGoogle(Code);
    console.log(code);
    if (code === '000000') {
      await getLocalAccountInfo();
      toast.success(t('common.toast.bind_success'));
    } else {
      toast.error(msg || t('common.toast.bind_error'));
    }
  };
  const verifyByTelegram = async (user: any) => {
    // const testData = {
    //   id: 5536129150,
    //   first_name: '子曰',
    //   username: 'Web3Follow',
    //   photo_url:
    //     'https://t.me/i/userpic/320/rZKOa2AjixP36NGHGFD9HEJBYyfehf-aLMrF7NL1INfMTQvWXCteIQJw158PFMR2.jpg',
    //   auth_date: 1702025683,
    //   hash: '0d694da3df3b10d7ee6d9d65bee7ff288b4cb21c0212c735125449b0163ec43c',
    // };
    const { code, msg } = await account.oauthTelegram({
      Id: user.id,
      Params: JSON.stringify(user),
    });
    if (code === '000000') {
      await getLocalAccountInfo();
      toast.success(t('common.toast.bind_success'));
    } else {
      toast.error(msg || t('common.toast.bind_error'));
    }
    console.log(code, msg);
  };
  const submit = async () => {
    try {
      const { code: resCode, msg } = await account.addGuardian({
        account: email,
        verifyCode: code,
        type: 'email',
      });
      if (resCode === '000000') {
        await getLocalAccountInfo();
        toast.success(t('common.toast.bind_success'));
      } else {
        toast.error(msg || t('common.toast.bind_error'));
      }

      nav(-1);
    } catch (error) {
      await toast.error(t('common.toast.bind_error'));
    }
  };
  const disabled = useMemo(
    () => !(checked && email && code),
    [checked, email, code],
  );
  return (
    <LayoutThird title={t('pages.account.protector.add_title')}>
      <div className='p-4'>
        <div className='text-14px mb-6'>
          {t('pages.account.protector.hint')}
        </div>
        <div>
          <div className='mb-6'>
            <EmailBox onChange={emailChange} />
          </div>
          <Checkbox
            className='mb-3'
            aria-label='checkbox'
            // isSelected={checked}
            onValueChange={checkboxChange}>
            <div className='text-3'>
              {t('pages.account.protector.hint_two')}
            </div>
          </Checkbox>
          <Button
            disabled={disabled}
            size='lg'
            loading={loading}
            className='mx-auto mb-2 w-full'
            onPress={submit}>
            {t('pages.account.protector.confirm')}
          </Button>
          <OauthThird
            onGoogleChange={oauthGoogle}
            onTelegramChange={verifyByTelegram}
          />
        </div>
      </div>
    </LayoutThird>
  );
}
