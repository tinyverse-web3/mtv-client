import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/form/Input';
import { Button } from '@/components/form/Button';
import { useNavigate } from 'react-router-dom';
import { useAccountStore, useRestoreStore } from '@/store';
import { useKeyPressEvent } from 'react-use';
import LayoutThird from '@/layout/LayoutThird';
import { toast } from 'react-hot-toast';
import account from '@/lib/account/account';
import { useHost } from '@/lib/hooks';
import { download, delay } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function PrivateDataVerify() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [customText, setCustomText] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAccountInfo, accountInfo, getLocalAccountInfo } = useAccountStore(
    (state) => state,
  );
  const { textPrivateData, passwordPrivateData, customPrivateData } =
    useRestoreStore((state) => state);
  const host = useHost();
  const add = async () => {
    setLoading(true);
    const privateArr = [text, password, customText];
    const privateFilter = privateArr.filter((v) => !!v);
    if (
      textPrivateData !== text ||
      passwordPrivateData !== password ||
      customText !== customPrivateData
    ) {
      toast.error(t('pages.account.encrypted_safe.verify_error'));
      setLoading(false);
      return;
    }
    try {
      const { code, msg } = await account.setPivateData(
        text,
        password,
        customText,
      );
      if (code === '000000') {
        setAccountInfo({ hasFeatureData: true });
        toast.success(t('pages.account.encrypted_safe.set_success'));
        await getLocalAccountInfo();
        if (accountInfo.hasFeatureData && accountInfo.isBackupMnemonic) {
          await downloadFile();
          await delay(1000)
          toast(t('pages.account.encrypted_safe.set_success'));
        }
        nav(-2);
      } else {
        toast.error(msg || t('pages.account.encrypted_safe.set_error'));
      }
    } catch (error) {
      toast.error(t('pages.account.encrypted_safe.set_error'));
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
    setText(e);
  };
  const onPasswordChange = (e: any) => {
    setPassword(e);
  };
  const onCustomChange = (e: any) => {
    setCustomText(e);
  };
  const url = useMemo(() => {
    return `${host}/sdk/downloadMnemonic`;
  }, [host]);
  const downloadFile = async () => {
    await download(url, 'mnemonic.txt');
    if (window.JsBridge) {
      await new Promise((resolve, reject) => {
        window.JsBridge.getDownloadStatus(async ({ code }: any) => {
          if (code == 0) {
            await getLocalAccountInfo();
            toast.success(t('pages.account.phrase.download_success'));
            resolve(true);
          } else {
            toast.success(t('pages.account.phrase.download_error'));
            reject(false);
          }
        });
      });
    } else {
    }
    console.log('下载完成');
  };
  return (
    <LayoutThird title={t('pages.account.encrypted_safe.verify_text')}>
      <div className='pt-8 px-6'>
        {/* <div className='mb-8 text-3'>
          保险箱用来保护无法用私钥加密，但是又必须保存在网络上的数据，比如账户的恢复信息。保险箱的原理是使用特征数据来保护秘密，特征数据是用户个人特有的，可以用来识别个人身份的，具备一定隐私性又不用依赖用户记忆的数据，其最佳来源是用户的生物特征，比如指纹和虹膜；另外是一辈子不会改变的数字，比如身份号码，甚至是个人常用的不容易忘记口令。恢复数据时，采集任意一组特征数据就可以正常恢复数据。提供更多的特征数据，账户越容易恢复，请至少提供两组不同的特征数据，形成双保险。特征数据保存在用户账户中，任何人都无法拿到数据。
        </div> */}
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
          {t('common.set_text')}
        </Button>
      </div>
    </LayoutThird>
  );
}
