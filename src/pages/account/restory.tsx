import { useState, useEffect } from 'react';
import { useGlobalStore, useAccountStore } from '@/store';
import { useCheckLogin } from '@/components/BindMail';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { ListRow } from './components';
import { toast } from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import { ValidPassword } from '@/components/ValidPassword';
import { useTranslation } from 'react-i18next';

export default function MultiVerify() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [type, setType] = useState(0);
  const [showPasswordStatus, setShowPasswordStatus] = useState(false);
  const { accountInfo, delAccount } = useAccountStore((state) => state);

  const validPasswordSuccess = (password: string) => {
    if (type === 1) {
      toPharse();
    } else if (type === 2) {
      toQuestion();
    }
  };
  const toPharse = async () => {
    // const loginStatus = await useCheckLogin();
    // if (loginStatus) {
    nav(ROUTE_PATH.ACCOUNT_PHRASE);
    // }·
  };
  const toProtector = async () => {
    const loginStatus = await useCheckLogin();

    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_PROTECTOR);
    }
  };
  const toQuestion = async () => {
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_QUESTION);
    }
  };
  const showVerifyPassword = (type: 1 | 2 | 3) => {
    if (!accountInfo.hasFeatureData) {
      toast(t('pages.account.toast.no_private'));
      return;
    }
    setShowPasswordStatus(true);
    setType(type);
  };
  return (
    <LayoutThird showBack title={t('pages.account.restore.title')}>
      <div className='p-4'>
        <ListRow
          label={t('pages.account.phrase.backup')}
          value={
            accountInfo.isBackupMnemonic ? t('pages.account.backup.on') : ''
          }
          onPress={toPharse}
        />
        <div className='border-1 border-solid border-gray-2 p-2 rounded-2 mb-6 text-[14px]'>
          {t('pages.account.phrase.hint')}
        </div>
        <ListRow
          label={t('pages.account.protector.title')}
          value={
            accountInfo.guardians?.length ? t('pages.account.backup.on') : ''
          }
          onPress={toProtector}
        />
        <div className='border-1 border-solid border-gray-2 p-2 rounded-2 mb-6 text-[14px]'>
          {t('pages.account.protector.hint')}
        </div>
        <ListRow
          label={t('pages.account.question.backup')}
          value={
            accountInfo.isBackupQuestion ? t('pages.account.backup.on') : ''
          }
          onPress={toQuestion}
        />
        <div className='border-1 border-solid border-gray-2 p-2 rounded-2 text-[14px]'>
          {t('pages.account.question.hint')}
        </div>
      </div>
      <ValidPassword
        onSuccess={validPasswordSuccess}
        show={showPasswordStatus}
        onClose={() => setShowPasswordStatus(false)}
      />
    </LayoutThird>
  );
}
