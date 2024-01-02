import { useState, useMemo } from 'react';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { EmailBox } from '@/components/form/EmailBox';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import account from '@/lib/account/account';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { OauthThird } from '@/components/OauthThird';

export default function Protector() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const query = useMemo(() => {
    return {
      email,
      confirmCode: code,
    };
  }, [email, code]);

  const emailChange = ({ email, code }: any) => {
    setEmail(email);
    setCode(code);
  };
  const oauthGoogle = async (res: any) => {
    const { code, msg, data } = await account.verifyByGoogle(res);
    console.log(data);
    if (code === '000000') {
      nav(
        `${ROUTE_PATH.RESTORE_PRIVATEDATA}?vault=${data.HasVault}&account=${data.Account}`,
      );
    } else {
      toast.error(msg);
    }
  };
  const submit = async () => {
    setLoading(true);
    try {
      const {
        code: resCode,
        msg,
        data,
      } = await account.verifyEmail({
        account: email,
        verifyCode: code,
      });
      if (resCode === '000000') {
        nav(`${ROUTE_PATH.RESTORE_PRIVATEDATA}?vault=${data}`);
      } else {
        toast.error(msg);
      }
    } catch (error) {
      setLoading(false);
      toast.error(t('pages.restore.toast.restore_error'));
    }
    setLoading(false);
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
    const { code, msg, data } = await account.verifyByTelegram({
      Id: user.id,
      FirstName: user.first_name,
      UserName: user.username,
      Hash: user.hash,
      AuthDate: user.auth_date,
      PhotoUrl: user.photo_url,
    });
    if (code === '000000') {
      nav(`${ROUTE_PATH.RESTORE_PRIVATEDATA}?vault=${data.HasVault}&account=${data.Account}`);
    } else {
      toast.error(msg);
    }
  };
  const disabled = useMemo(() => !(email && code), [email, code]);
  return (
    <LayoutThird title={t('pages.restore.title')} path={ROUTE_PATH.RESTORE}>
      <div className='p-4'>
        <div>
          <div className='mb-6'>
            <EmailBox onChange={emailChange} />
          </div>
          <Button
            disabled={disabled}
            size='lg'
            loading={loading}
            fullWidth
            className=' mb-2'
            onPress={submit}>
            {t('common.confirm')}
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
