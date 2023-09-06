import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutThird from '@/layout/LayoutThird';
import FileItem from './components/FileItem';
import { useAccountStore } from '@/store';
import toast from 'react-hot-toast';
import { useList } from 'react-use';
import { PublicPasswordModal } from './components/PublicPasswordModal';
import { useFileStore } from '@/store';
import account from '@/lib/account/account';
import { ROUTE_PATH } from '@/router';
import { Empty } from '@/components/Empty';
import { useTranslation } from 'react-i18next';

export default function Album() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File>();
  // const [securityList, { set: setSecurityList }] = useList<any>([]);
  // const [publicList, { set: setPublicList }] = useList<any>([]);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState('security' as any);
  const [delItem, setDelItem] = useState<any>(null);
  const [passwordType, setPasswordType] = useState('upload');
  const { publicList, securityList, getPublicList, getSecruityList } =
    useFileStore((state) => state);
  const passwordChange = async (pwd: string) => {
    if (passwordType === 'upload') {
      await upload({ file, type: fileType, password: pwd });
    } else {
      console.log('downloadHandler', delItem);
      await downloadFile({ Filename: delItem?.Filename, Password: pwd });
    }
    setShowModal(false);
  };
  const fileChange = async (e: any) => {
    const _file = e.target.files[0];
    await upload({ file: _file, type: fileType });
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
    } else if (fileType === 'security') {
      await getSecruityList();
    } else {
      await getPublicList();
    }
  };

  const list = useMemo(() => {
    return fileType === 'security' ? securityList : publicList;
  }, [fileType, securityList, publicList]);
  const downloadHandler = async (item: any) => {
    // if (fileType === 'security') {
    console.log(item);
    await downloadFile({ Filename: item.Filename, Type: fileType });
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
        Type: fileType,
        Password,
      });
      if (code === '000000') {
        toast.success(`${t('pages.space.album.download_text')}: ${data}`);
      } else {
        toast.error(msg);
      }
    }
  };
  const fileTypes = [
    {
      label: t('pages.space.file.tab_security'),
      value: 'security',
    },
    {
      label: t('pages.space.file.tab_public'),
      value: 'public',
    },
  ];
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
      path={ROUTE_PATH.SPACE_INDEX}
      rightContent={
        <label className='w-full h-full flex items-center justify-center'>
          <div className='i-mdi-plus-circle-outline text-5'></div>
          <input
            type='file'
            // accept='image/*'
            onChange={fileChange}
            className='invisible w-0 h-0'
          />
        </label>
      }>
      <div className='p-4'>
        <div className='flex mb-4'>
          {fileTypes.map((item) => (
            <div className='min-w-20 px-2 flex justify-center' key={item.value}>
              <div
                className={`${
                  fileType === item.value
                    ? 'border-b-2 border-b-solid text-blue-5'
                    : ''
                } cursor-pointer`}
                onClick={() => setFileType(item.value)}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
        <div className=''>
          {list?.length ? (
            list.map((item: any) => (
              <FileItem
                key={item.URL}
                item={item}
                type={fileType}
                delSuccess={delSuccess}
                onDownload={() => downloadHandler(item)}
              />
            ))
          ) : (
            <Empty />
          )}
        </div>
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
