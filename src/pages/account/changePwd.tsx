import { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/form/Button';
import { Password } from '@/components/form/Password';
import { toast } from 'react-hot-toast';
import { validatePassword } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAccountStore } from '@/store';
import account from '@/lib/account/account';
import LayoutThird from '@/layout/LayoutThird';
import { useTranslation } from 'react-i18next';

export default function ChangePwd() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [oldPwd, setOldPwd] = useState('');
  const [pwd, setPwd] = useState('');
  const [checked, setChecked] = useState(false);
  const [confirmPwd, setConfirmPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [validStatus, setValidStatus] = useState(true);
  const [confirmStatus, setConfirmStatus] = useState(true);
  const [isBiometricsSatus, setIsBiometricsSatus] = useState(false);
  const [err, setErr] = useState(false);
  const { accountInfo, setAccountInfo } = useAccountStore((state) => state);

  const changePassword = async () => {
    if (oldPwd === pwd) {
      toast.error('common.password.confirm_error');
      return;
    }
    if (pwd !== confirmPwd) {
      setConfirmStatus(false);
      return;
    }
    const validStatus = await validatePassword(pwd);
    if (!validStatus.value) {
      setValidStatus(false);
      return;
    }
    setLoading(true);
    const { code, msg } = await account.changePassword({
      oldPwd,
      newPwd: pwd,
      saveStatus: checked,
    });
    setLoading(false);
    if (code === '000000') {
      setAccountInfo({ isDefaultPwd: false });
      if (isBiometricsSatus && window.JsBridge) {
        setupBiometrics(pwd);
      } else {
        toast.success(t('common.password.change_success'));
        nav(-1);
      }
    } else {
      setErr(true);
      toast.error(msg);
    }
  };
  const setupBiometrics = async (password: string) => {
    window?.JsBridge.setupBiometrics(password, ({ code, message }: any) => {
      if (code === 0) {
        nav(-1);
        toast.success(message);
      } else {
        toast.error(message);
      }
    });
  };
  const helper = useMemo<{ text: string; color: 'default' | 'error' }>(() => {
    if (!err)
      return {
        text: `${t('common.password.default_text')}：123456`,
        color: 'default',
      };
    return {
      text: t('common.password.old_error'),
      color: 'error',
    };
  }, [err]);
  const oldPwdChange = (e: any) => {
    setErr(false);
    setOldPwd(e?.trim());
  };
  const getBiometricsSetUp = () => {
    if (window?.JsBridge) {
      window?.JsBridge.isBiometricsSetUp(({ code, message }: any) => {
        if (code === 0) {
          setIsBiometricsSatus(true);
        } else {
          setIsBiometricsSatus(false);
        }
      });
    }
  };
  useEffect(() => {
    getBiometricsSetUp();
  }, []);
  return (
    <LayoutThird showBack title={t('common.password.change_text')}>
      <div className='pt-6 px-6'>
        <div className='mb-8'>
          <Password
            maxLength={20}
            value={oldPwd}
            helperColor={helper.color}
            helperText={helper.text}
            onChange={oldPwdChange}
            status={err ? 'error' : 'default'}
            placeholder={t('common.password.old_text')}
            initialValue=''
          />
        </div>
        <div className='mb-3'>
          <Password
            value={pwd}
            disabled={!oldPwd}
            className='mb-1'
            helperColor={validStatus ? 'default' : 'error'}
            status={validStatus ? 'default' : 'error'}
            onChange={(e: string) => setPwd(e?.trim())}
            placeholder={t('common.password.new_text')}
          />
          <div className='text-12px pl-8px'>
            {t('common.password.rule_text')}
          </div>
        </div>
        <div className='mb-4'>
          <Password
            disabled={!pwd}
            value={confirmPwd}
            helperColor={confirmStatus ? 'default' : 'error'}
            status={confirmStatus ? 'default' : 'error'}
            helperText={
              confirmStatus ? '' : t('common.password.unanimous_error')
            }
            onChange={(e: string) => setConfirmPwd(e.trim())}
            placeholder={t('common.password.confirm_text')}
            initialValue=''
          />
        </div>

        <Button
          disabled={!(pwd && oldPwd && confirmPwd)}
          className='mx-auto'
          loading={loading}
          onPress={changePassword}>
          {t('common.password.change')}
        </Button>
      </div>
    </LayoutThird>
  );
}
