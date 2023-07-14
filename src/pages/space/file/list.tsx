import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import LayoutThird from '@/layout/LayoutThird';
import FileItem from './components/FileItem';
import { useAccountStore } from '@/store';
import toast from 'react-hot-toast';
import { useList } from 'react-use';
import { PublicPasswordModal } from './components/PublicPasswordModal';
export default function Album() {
  const nav = useNavigate();
  const { account } = useAccountStore((state) => state);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File>();
  const [securityList, { set: setSecurityList }] = useList<any>([]);
  const [publicList, { set: setPublicList }] = useList<any>([]);
  const [fileType, setFileType] = useState('security' as any);

  const passwordChange = async (pwd: string) => {
    await upload({ file, type: fileType, password: pwd });
    setShowModal(false);
  };
  const fileChange = async (e: any) => {
    const _file = e.target.files[0];
    if (fileType === 'security') {
      await upload({ file: _file, type: fileType });
    } else {
      setFile(_file);
      setShowModal(true);
    }
  };
  const upload = async ({ file, type, password }: any) => {
    const { code, msg } = await account.uploadFile({ file, type, password });
    if (code === '000000') {
      toast.success('上传成功');
      getList();
    } else {
      toast.error(msg);
      throw new Error(msg);
    }
  };
  const getList = async (all?: boolean) => {
    if (all) {
      await Promise.all([getSecruityList(), getPublicList()]);
    } else if (fileType === 'security') {
      await getSecruityList();
    } else {
      await getPublicList();
    }
  };
  const getSecruityList = async () => {
    const { code, msg, data } = await account.getFileList({ type: 'security' });
    if (code === '000000') {
      setSecurityList(data || []);
    } else {
      toast.error(msg);
    }
  }
  const getPublicList = async () => {
    const { code, msg, data } = await account.getFileList({ type: 'public' });
    if (code === '000000') {
      setPublicList(data || []);
    } else {
      toast.error(msg);
    }
  }
  const list = useMemo(() => {
    return fileType === 'security' ? securityList : publicList;
  }, [fileType, securityList, publicList]);

  const fileTypes = [
    {
      label: '个人文件',
      value: 'security',
    },
    {
      label: '共享文件',
      value: 'public',
    },
  ];
  useEffect(() => {
    getList(true);
  }, []);
  return (
    <LayoutThird
      title='相册'
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
            <div className='w-20 flex justify-center' key={item.value}>
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
          {list.map((item: any) => (
            <FileItem key={item.URL} item={item} />
          ))}
        </div>
      </div>
      <PublicPasswordModal show={showModal} onChange={passwordChange} />
    </LayoutThird>
  );
}
