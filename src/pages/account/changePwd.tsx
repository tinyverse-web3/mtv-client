import { useState, useMemo, useRef, useEffect } from 'react';
import { Text, Checkbox, Row, Button, Input } from '@nextui-org/react';
import { STATUS_CODE } from '@/lib/account/account';
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
    const { code, msg } = await account.changePassword({
      oldPwd,
      newPwd: pwd,
      saveStatus: checked,
    });
    if (code === '000000') {
      setAccountInfo({ isDefaultPwd: false });
      if (isBiometricsSatus && window.JsBridge) {
        setupBiometrics(pwd);
      }
      toast.success(t('common.password.change_success'));
      nav(-1);
    } else {
      setErr(true);
      toast.error(msg);
    }
  };
  const setupBiometrics = async (password: string) => {
    window?.JsBridge.setupBiometrics(password, ({ code, message }: any) => {
      if (code === 0) {
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
    setOldPwd(e.target.value?.trim());
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
        <Row className='mb-8' justify='center'>
          <Input.Password
            clearable
            bordered
            aria-label='password'
            fullWidth
            maxLength={20}
            type='password'
            value={oldPwd}
            helperColor={helper.color}
            helperText={helper.text}
            onChange={oldPwdChange}
            status={err ? 'error' : 'default'}
            placeholder={t('common.password.old_text')}
            initialValue=''
          />
        </Row>
        <div className='mb-3'>
          <Input.Password
            clearable
            bordered
            aria-label='password'
            fullWidth
            value={pwd}
            disabled={!oldPwd}
            className='mb-1'
            helperColor={validStatus ? 'default' : 'error'}
            status={validStatus ? 'default' : 'error'}
            onChange={(e) => setPwd(e.target.value?.trim())}
            placeholder={t('common.password.new_text')}
          />
          <div className='text-12px pl-8px'>
            {t('common.password.rule_text')}
          </div>
        </div>
        <Row className='mb-4' justify='center'>
          <Input.Password
            clearable
            bordered
            fullWidth
            aria-label='password'
            disabled={!pwd}
            value={confirmPwd}
            helperColor={confirmStatus ? 'default' : 'error'}
            status={confirmStatus ? 'default' : 'error'}
            helperText={
              confirmStatus ? '' : t('common.password.unanimous_error')
            }
            onChange={(e) => setConfirmPwd(e.target.value.trim())}
            placeholder={t('common.password.confirm_text')}
            initialValue=''
          />
        </Row>
        {/* {accountInfo.bindStatus && (
          <Checkbox
            className='mb-3'
            aria-label='checkbox'
            // isSelected={checked}
            onChange={checkboxChange}>
            <Text className='text-3'>
              {t('common.password.save_hint')}
            </Text>
          </Checkbox>
        )} */}

        <Button
          disabled={!(pwd && oldPwd && confirmPwd)}
          className='mx-auto'
          onPress={changePassword}>
          {t('common.password.change')}
        </Button>
      </div>
    </LayoutThird>
  );
}
