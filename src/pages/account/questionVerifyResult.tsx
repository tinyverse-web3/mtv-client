import { useEffect } from 'react';
import { Image, Button } from '@nextui-org/react';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  useQuestionStore,
} from '@/store';
import account from '@/lib/account/account';
import imageSuccess from '@/assets/images/icon-success.png';
import imageError from '@/assets/images/icon-error.png';
import { useTranslation } from 'react-i18next';

export default function QuestionVerifyResult() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { state } = useLocation();
  const { list: initList, type } = useQuestionStore((state) => state);

  const toAccount = async () => {
    nav(ROUTE_PATH.ACCOUNT);
  };

  const onSubmit = async () => {
    console.log(initList);
    try {
      await account.backupByQuestion({ list: initList, type });
      toast.success(t('common.toast.backup_success'));
      toAccount();
    } catch (error) {
      console.log(error);
      toast.error(t('common.toast.backup_error'));
    }
  };

  useEffect(() => {
    if (!initList.length) {
      nav(ROUTE_PATH.ACCOUNT_QUESTION);
    }
  }, []);
  return (
    <LayoutThird title={t('pages.account.question.backup')}>
      {state ? (
        <div className='px-6 pt-10'>
          <Image src={imageSuccess} className='w-40 mb-10' />
          <Button className='w-full' size='lg' onPress={onSubmit}>
            {t('common.confirm')}
          </Button>
        </div>
      ) : (
        <div className='px-6 pt-10'>
          <Image src={imageError} className='w-40 mb-10' />
          <Button className='w-full mb-6' size='lg' onPress={() => nav(-1)}>
          {t('pages.account.question.test_text')}
          </Button>
          <Button
            className='w-full'
            size='lg'
            onPress={() => nav(ROUTE_PATH.ACCOUNT_QUESTION)}>
            
            {t('pages.account.question.retry_text')}
          </Button>
        </div>
      )}
    </LayoutThird>
  );
}
