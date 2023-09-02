import { Text, Row, Image } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import { useNavigate } from 'react-router-dom';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
export default function Restore() {
  const { t } = useTranslation();
  const nav = useNavigate();

  const toPhrase = () => {
    nav(ROUTE_PATH.RESTORE_PHRASE);
  };
  const toProtector = () => {
    nav(ROUTE_PATH.RESTORE_PROTECTOR);
  };
  const toQuestionVerify = () => {
    nav(ROUTE_PATH.RESTORE_VERIFY);
  };
  return (
    <LayoutThird title={t('pages.restore.title')}>
      <div className='pt-7 px-6'>
        <Image src='/icon-restore.png' className='mb-12 w-40' />
        <Button
          className='m-auto mb-4 w-full bg-cyan-700'
          onPress={toPhrase}
          size='xl'>
          {t('pages.restore.phrase.title')}
        </Button>
        <Button
          className='m-auto mb-4 w-full bg-blue-8'
          size='xl'
          onPress={toProtector}>
          {t('pages.restore.protector.title')}
        </Button>
        <Button
          className='m-auto mb-4 w-full bg-blue-9'
          size='xl'
          onPress={toQuestionVerify}>
          {t('pages.restore.question.title')}
        </Button>
      </div>
    </LayoutThird>
  );
}
