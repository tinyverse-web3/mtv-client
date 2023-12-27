import { Image } from '@nextui-org/react';
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
    <LayoutThird title={t('pages.restore.title')} path={ROUTE_PATH.INDEX}>
      <div className='pt-7 px-6'>
        <div className='flex justify-center mb-12 '>
          <Image src='/icon-restore.png' className='w-40 mx-auto' />
        </div>

        <Button className='mb-4' fullWidth onPress={toPhrase} size='lg'>
          {t('pages.restore.phrase.title')}
        </Button>
        <Button className='mb-4' size='lg' fullWidth onPress={toProtector}>
          {t('pages.restore.protector.title')}
        </Button>
        {/* <Button className='mb-4' fullWidth size='lg' onPress={toQuestionVerify}>
          {t('pages.restore.question.title')}
        </Button> */}
      </div>
    </LayoutThird>
  );
}
