import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutThird from '@/layout/LayoutThird';
import { Tabs, Tab } from '@nextui-org/react';
import FileItem from './components/FileItem';
import { useAccountStore } from '@/store';
import toast from 'react-hot-toast';
import { Icon } from '@iconify/react';
import { PublicPasswordModal } from './components/PublicPasswordModal';
import { useFileStore } from '@/store';
import account from '@/lib/account/account';
import { ROUTE_PATH } from '@/router';
import { Empty } from '@/components/Empty';
import { useTranslation } from 'react-i18next';

export default function Album() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [selected, setSelected] = useState('security');
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File>();
  // const [securityList, { set: setSecurityList }] = useList<any>([]);
  // const [publicList, { set: setPublicList }] = useList<any>([]);
  const [loading, setLoading] = useState(false);
  const [delItem, setDelItem] = useState<any>(null);
  const [passwordType, setPasswordType] = useState('upload');
  const { publicList, securityList, getPublicList, getSecruityList } =
    useFileStore((state) => state);
  const passwordChange = async (pwd: string) => {
    if (passwordType === 'upload') {
      await upload({ file, type: selected, password: pwd });
    } else {
      console.log('downloadHandler', delItem);
      await downloadFile({ Filename: delItem?.Filename, Password: pwd });
    }
    setShowModal(false);
  };
  const fileChange = async (e: any) => {
    const _file = e.target.files[0];
    await upload({ file: _file, type: selected });
    e.target.value = '';
  };
  const upload = async ({ file, type, password }: any) => {
    const { code, msg } = await account.uploadFile({ file, type, password });
    if (code === '000000') {
      toast.success(t('common.upload.success'));
      getList();
    } else {
      toast.error(msg);
      throw new Error(msg);
    }
  };
  const getList = async (all?: boolean) => {
    if (all) {
      if (!publicList?.length || !securityList.length) {
        setLoading(true);
      }
      await Promise.all([getSecruityList(), getPublicList()]);
      setLoading(false);
    } else if (selected === 'security') {
      await getSecruityList();
    } else {
      await getPublicList();
    }
  };
  const downloadHandler = async (item: any) => {
    // if (selected === 'security') {
    console.log(item);
    await downloadFile({ Filename: item.Filename, Type: selected });
    // } else {
    //   setDelItem(item);
    //   setPasswordType('download');
    //   setShowModal(true);
    // }
  };
  const modalClose = () => {
    setShowModal(false);
  };
  const downloadFile = async ({ Filename, Password = '' }: any) => {
    if (Filename) {
      const { code, msg, data } = await account.downloadFile({
        Filename,
        Type: selected,
        Password,
      });
      if (code === '000000') {
        toast.success(`${t('pages.space.album.download_text')}: ${data}`);
      } else {
        toast.error(msg);
      }
    }
  };

  const delSuccess = () => {
    getList();
  };
  useEffect(() => {
    getList(true);
  }, []);
  return (
    <LayoutThird
      title={t('pages.space.file.title')}
      loading={loading}
      onSelectChange={setSelected}
      path={ROUTE_PATH.SPACE_INDEX}
      rightContent={
        <label className='w-full h-full flex items-center justify-center'>
          <Icon icon='mdi:plus-circle-outline' className=' text-xl' />
          <input
            type='file'
            // accept='image/*'
            onChange={fileChange}
            className='invisible w-0 h-0'
          />
        </label>
      }>
      <div className='p-2'>
        <Tabs fullWidth size='md' aria-label='Tabs form'>
          <Tab key='security' title={t('pages.space.file.tab_security')}>
            {securityList?.length ? (
              securityList.map((item: any) => (
                <FileItem
                  key={item.URL}
                  item={item}
                  type={selected}
                  delSuccess={delSuccess}
                  onDownload={() => downloadHandler(item)}
                />
              ))
            ) : (
              <Empty />
            )}
          </Tab>
          <Tab key='public' title={t('pages.space.file.tab_public')}>
            {publicList?.length ? (
              publicList.map((item: any) => (
                <FileItem
                  key={item.URL}
                  item={item}
                  type={selected}
                  delSuccess={delSuccess}
                  onDownload={() => downloadHandler(item)}
                />
              ))
            ) : (
              <Empty />
            )}
          </Tab>
        </Tabs>
      </div>
      <PublicPasswordModal
        btnText={passwordType === 'upload' ? '上传' : '下载'}
        show={showModal}
        onClose={modalClose}
        onChange={passwordChange}
      />
    </LayoutThird>
  );
}
