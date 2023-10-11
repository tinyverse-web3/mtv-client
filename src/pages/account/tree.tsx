import { BranchLock } from './components/tree/BranchLock';
import { BranchNode } from './components/tree/BranchNode';
import TreeAi from '@/assets/images/tree-ai.png';
import TreeBoxOne from '@/assets/images/tree-box-1.png';
import TreeBoxTwo from '@/assets/images/tree-box-2.png';
import TreeTrapezoid from '@/assets/images/tree-trapezoid.png';
import LayoutThird from '@/layout/LayoutThird';
import { useCheckLogin } from '@/components/BindMail';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useAccountStore } from '@/store';
import { useTranslation } from 'react-i18next';

export default function Tree() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { accountInfo } = useAccountStore((state) => state);
  const toPrivateData = async () => {
    nav(ROUTE_PATH.ACCOUNT_PRIVATEDATA);
  };
  const toProtector = async () => {
    const loginStatus = await useCheckLogin();

    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_PROTECTOR);
    }
  };
  const toPharse = async () => {
    nav(ROUTE_PATH.ACCOUNT_PHRASE);
  };
  const toQuestion = async () => {
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_QUESTION);
    }
  };
  return (
    <LayoutThird showBack title={t('pages.account.tree.title')}>
      <div className='w-screen h-screen relative scale-90 -mt-[10%] -mb-[10%]'>
        <img
          src={TreeAi}
          className='w-[60px] h-[6-px] absolute  bottom-[90vh] left-1/2 -translate-x-1/2'
        />
        <div className='w-[90vw] h-[5px] absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#1296DB] z-10'></div>

        <div
          className='w-[42px] h-[42px] absolute  bottom-[92vh] right-[10vw]'
          onClick={toPrivateData}>
          <img
            src={accountInfo.hasFeatureData ? TreeBoxTwo : TreeBoxOne}
            alt=''
            className='w-full h-full'
          />
          <div className='text-xs text-center text-[#63A103]'>
            {t('pages.account.tree.box')}
          </div>
        </div>
        <div className='h-[90vh] w-[3px] absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#1296DB]'></div>

        {/* <div className='w-[50vw] h-[1px] absolute bottom-[80vh] left-[18vw]  tree-dashed'></div> */}
        <div className='absolute bottom-[82vh] left-[19vw] z-10'>
          <BranchNode
            text={t('pages.account.tree.node_1')}
            status={accountInfo.hasPrivacyByVault ? 2 : 3}
            lock
          />
        </div>
        <div className='absolute bottom-[62vh] left-1/2 -translate-x-[34vw]'>
          <BranchLock isLock={accountInfo.hasPrivacyByVault} />
        </div>
        <div className='absolute bottom-[62vh]  -translate-x-1/2 left-[19vw] z-10'>
          <BranchNode
            text={t('pages.account.tree.node_1')}
            status={accountInfo.hasPrivacy ? 2 : 3}
            onClick={toQuestion}
          />
        </div>
        <div className='w-[32vw] h-[3px] absolute bottom-[59vh] left-1/2 -translate-x-[97%] rotate-[20deg]  bg-[#1296DB]'></div>

        {/* <div className='w-[50vw] h-[1px] absolute bottom-[50vh] left-[19vw]  tree-dashed'></div> */}
        <div className='absolute bottom-[50vh]  left-[19vw] z-10'>
          <BranchNode
            text={
              <>
                {t('pages.account.tree.node_2')}
                <br />
                {t('common.backup')}
              </>
            }
            lock
            onClick={toPharse}
            status={accountInfo.isBackupMnemonic ? 2 : 3}
          />
        </div>
        <div className='absolute bottom-[30vh] left-1/2 -translate-x-[34vw]'>
          <BranchLock isLock={accountInfo.isBackupMnemonic} />
        </div>
        <div className='absolute bottom-[30vh] left-[19vw] z-10'>
          <BranchNode
            text={
              <>
                {t('pages.account.tree.node_2')}
                <br />
                {t('common.backup')}
              </>
            }
            status={2}
          />
        </div>
        <div className='w-[32vw] h-[3px] absolute bottom-[27vh] left-1/2 -translate-x-[97%] rotate-[20deg]  bg-[#1296DB]'></div>

        {/* <div className='w-[1px] h-[30vh] absolute bottom-[50vh] left-[68vw]  tree-dashed-vertical'></div> */}

        {/* <div className='w-[12vw] h-[1px] absolute bottom-[64vh] left-[68vw]  tree-dashed'></div> */}
        <div className='absolute bottom-[64vh]  right-[20vw]  z-10'>
          <BranchNode
            text={
              <>
                {t('pages.account.tree.node_3')}
                <br />
                {t('common.backup')}
              </>
            }
            lock
            status={accountInfo.hasGuardianByVault ? 2 : 3}
          />
        </div>
        <div className='absolute bottom-[44vh] left-1/2 translate-x-[27vw]'>
          <BranchLock isLock={accountInfo.hasGuardianByVault} />
        </div>
        <div className='absolute bottom-[44vh] right-[20vw]  z-10'>
          <BranchNode
            text={
              <>
                {t('pages.account.tree.node_3')}
                <br />
                {t('common.backup')}
              </>
            }
            onClick={toProtector}
            status={accountInfo.hasGuardian ? 2 : 3}
          />
        </div>
        <div className='w-[32vw] h-[3px] absolute bottom-[41vh] left-1/2 -translate-x-[3%] -rotate-[20deg]  bg-[#1296DB]'></div>

        <div className='absolute bottom-[21vh]  right-[20vw]  z-10'>
          <BranchNode
            text={
              <>
                {t('pages.account.tree.node_4')}
                <br />
                {t('common.backup')}
              </>
            }
            status={4}
          />
        </div>
        <div className='w-[32vw] h-[3px] absolute bottom-[18vh] left-1/2 -translate-x-[3%] -rotate-[20deg] tree-dashed'></div>

        <div className='bg-white absolute left-1/2 -translate-x-1/2 bottom-0 w-[30vw] h-[7vh]'>
          <img src={TreeTrapezoid} className='w-full h-full' />
          <div className='text-center text-sm  top-0 flex justify-center items-center font-bold absolute w-full h-full'>
            {t('pages.account.tree.title')}
          </div>
        </div>
      </div>
      <div className='p-4 -mt-8'>
        <div className='hint-text-box'>{t('pages.account.tree.hint')}</div>
      </div>
    </LayoutThird>
  );
}
