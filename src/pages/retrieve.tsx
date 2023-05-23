import { useState, useRef, useEffect } from 'react';
import { Checkbox, Text, Image, Input } from '@nextui-org/react';
import { EmailBox } from '@/components/form/EmailBox';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '@/api';
import { useWalletStore } from '@/store';
import { validatePassword } from '@/lib/utils';
import toast from 'react-hot-toast';
import wallet, { STATUS_CODE, Password } from '@/lib/account/wallet';
import imageSuccess from '@/assets/images/icon-success.png';
// import { SendEmail } from '@/components/SendEmail';

export default function Retrieve() {
  const [step, setStep] = useState(1);
  const nav = useNavigate();
  const passwordManager = new Password();
  const [verifyCode, setVerifyCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [oldPwd, setOldPwd] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [validStatus, setValidStatus] = useState(true);
  const [confirmStatus, setConfirmStatus] = useState(true);
  const [err, setErr] = useState(false);

  const emailChange = ({ email, code }: any) => {
    setEmail(email);
    setCode(code);
  };
  const generateQuery = async () => {
    query.current.password = await passwordManager.encrypt(pwd);
  };
  const query = useRef({ password: '' });
  useEffect(() => {
    generateQuery();
  }, [pwd]);
  const { mutate: savePassword } = useRequest(
    {
      url: '/user/savepassword',
      arg: {
        method: 'post',
        auth: true,
        query: query.current,
      },
    },
    {
      onSuccess(res) {},
    },
  );
  const { mutate: verifyEmail } = useRequest({
    url: '/user/getpassword',
    arg: {
      auth: true,
      method: 'post',
      query: { email, confirmCode: code },
    },
  });

  const verifyEmial = async () => {
    const res = await verifyEmail();
    console.log(res);
    if (res.data) {
      setStep(2);
      setOldPwd(res.data);
    } else {
      toast.error('没有存储任何密码，无法找回！');
    }
  };

  const changePassword = async () => {
    if (oldPwd === pwd) {
      toast.error('新密码不能与旧密码相同');
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
    console.log(oldPwd, pwd)
    const status = await wallet?.verfiyHashPwd(oldPwd);
    if (status === STATUS_CODE.INVALID_PASSWORD) {
      toast.error('原始密码错误');
    } else {
      await wallet?.changeHashPwd(oldPwd, pwd);
      // nav(ROUTE_PATH.SPACE_INDEX);
      toast.success('修改成功');
      setStep(3);
    }
  };
  const changePwd = async () => {
    await changePassword();
    await savePassword();
  };
  // const unlock = async () => {
  //   setLoading(true);
  //   const status = await wallet?.verify(pwd);
  //   console.log(status);
  //   if (status === STATUS_CODE.INVALID_PASSWORD) {
  //     setErr(true);
  //   } else {
  //     setWallet(wallet);
  //     const { publicKey, privateKey } = wallet || {};
  //     if (privateKey) {
  //       await initMtvStorage(privateKey);
  //     }
  //     nav(ROUTE_PATH.SPACE_INDEX);
  //   }
  //   setLoading(false);
  // };
  const toUnlock = () => {
    nav(ROUTE_PATH.UNLOCK, { replace: true });
  };
  const stepClick = (i: number) => {
    if (i < step - 1) {
      setStep(i + 1);
    }
  };

  const setArr = [
    {
      text: '验证身份',
    },
    {
      text: '设置新密码',
    },
    {
      text: '完成',
    },
  ];
  return (
    <LayoutThird title='找回密码' path={ROUTE_PATH.UNLOCK}>
      <div className=''>
        <div className='flex h-12'>
          {setArr.map((v, i) => (
            <div
              key={i}
              onClick={() => stepClick(i)}
              className={`w-1/3 h-full flex justify-center items-center text-3 cursor-pointer border-b border-b-gray-300 border-b-solid ${
                i !== 3 ? 'border-r border-gray-300 border-r-solid' : ''
              } ${i < step ? 'bg-blue-7 text-white' : 'bg-gray-3'}`}>
              {v.text}
            </div>
          ))}
        </div>
        <div className='p-6'>
          {step === 1 && (
            <div>
              <div className='mb-4'>
                <EmailBox onChange={emailChange} />
              </div>

              <Button
                className='w-full bg-blue-7'
                size='lg'
                onPress={verifyEmial}>
                验证
              </Button>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className='mb-8'>
                <Input.Password
                  clearable
                  bordered
                  aria-label='password'
                  fullWidth
                  value={pwd}
                  className='h-50px'
                  helperColor={validStatus ? 'default' : 'error'}
                  status={validStatus ? 'default' : 'error'}
                  helperText='密码至少8位，包括数字、大小写字母和符号至少2种'
                  onChange={(e) => setPwd(e.target.value?.trim())}
                  placeholder='新密码'
                />
              </div>
              <Input.Password
                clearable
                bordered
                fullWidth
                aria-label='password'
                disabled={!pwd}
                className='mb-6 h-50px'
                value={confirmPwd}
                helperColor={confirmStatus ? 'default' : 'error'}
                status={confirmStatus ? 'default' : 'error'}
                helperText={confirmStatus ? '' : '密码不一致'}
                onChange={(e) => setConfirmPwd(e.target.value.trim())}
                placeholder='确认密码'
                initialValue=''
              />
              <Button
                className='w-full bg-blue-7'
                size='lg'
                onPress={changePwd}>
                修改
              </Button>
            </div>
          )}
          {step === 3 && (
            <div className='px-6 pt-10'>
              <Image src={imageSuccess} className='w-40 mb-10' />
              <Button className='w-full bg-blue-7' size='lg' onPress={toUnlock}>
                完成
              </Button>
            </div>
          )}
        </div>
      </div>
    </LayoutThird>
  );
}
