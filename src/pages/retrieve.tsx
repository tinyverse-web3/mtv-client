import { useState, useMemo } from 'react';
import { Checkbox, Text, Image, Input } from '@nextui-org/react';
import { Button } from '@/components/form/Button';
import LayoutThird from '@/layout/LayoutThird';
import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '@/api';
import { useWalletStore } from '@/store';
import { useCountDown } from '@/lib/hooks';
import toast from 'react-hot-toast';
import imageSuccess from '@/assets/images/icon-success.png';
// import { SendEmail } from '@/components/SendEmail';

export default function Retrieve() {
  const [step, setStep] = useState(1);
  const nav = useNavigate();
  const [verifyCode, setVerifyCode] = useState('');
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [validStatus, setValidStatus] = useState(true);
  const [confirmStatus, setConfirmStatus] = useState(true);
  const [err, setErr] = useState(false);
  const wallet = useWalletStore((state) => state.wallet);

  const emailChange = ({ email, code }: any) => {
    setEmail(email);
    setCode(code);
  };
  const sendEmail = () => {
    setStep(2);
  };
  const checkboxChange = (e: boolean) => {
    setChecked(e);
  };
  const { start, text, flag } = useCountDown(60);

  const { mutate: sendCode, loading: codeLoading } = useRequest(
    {
      url: '/user/sendmail4verifycode',
      arg: {
        method: 'post',
        query: { email },
      },
    },
    {
      onSuccess(res) {
        if (res.code === '000000') {
          toast.success('验证码已发送');
          start();
        } else {
          toast.error(res.msg);
        }
      },
    },
  );
  const verifyCodeChange = (e: any) => {
    setVerifyCode(e.target.value);
  };
  const sendVerify = async () => {
    if (email && flag) {
      await sendCode();
    }
  };
  const verifyEmial = () => {
    setStep(3);
  };
  const changePwd = () => {
    setStep(4);
  };

  const toUnlock = () => {
    nav(-1);
  };
  const stepClick = (i: number) => {
    if (i < step - 1) {
      setStep(i + 1);
    }
  };

  const setArr = [
    {
      text: '输入账号',
    },
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
              className={`w-1/4 h-full flex justify-center items-center text-3 cursor-pointer border-b border-b-gray-300 border-b-solid ${
                i !== 3 ? 'border-r border-gray-300 border-r-solid' : ''
              } ${i < step ? 'bg-blue-5 text-white' : 'bg-gray-3'}`}>
              {v.text}
            </div>
          ))}
        </div>
        <div className='p-6'>
          {step === 1 && (
            <div>
              <Input
                clearable
                bordered
                fullWidth
                type='email'
                aria-label='email'
                color='primary'
                size='lg'
                value={email}
                onChange={emailChange}
                placeholder='邮箱'
                className='mb-4'
                contentLeft={<div className='i-mdi-email color-current' />}
              />
              <Button className='w-full' size='lg' onPress={sendEmail}>
                发送Emial
              </Button>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className='flex mb-4'>
                <Input
                  clearable
                  bordered
                  fullWidth
                  type='number'
                  maxLength={6}
                  aria-label='验证码'
                  className='flex-1'
                  color='primary'
                  size='lg'
                  value={verifyCode}
                  onChange={verifyCodeChange}
                  placeholder='验证码'
                  contentRightStyling={false}
                  contentRight={
                    <div className='p-2'>
                      <Button
                        auto
                        className='min-w-20 text-12px h-7'
                        color='secondary'
                        loading={codeLoading}
                        onPress={sendVerify}>
                        {text}
                      </Button>
                    </div>
                  }
                  contentLeft={
                    <div className='i-mdi-shield-outline color-current' />
                  }
                />
              </div>
              <Button className='w-full' size='lg' onPress={verifyEmial}>
                验证
              </Button>
            </div>
          )}
          {step === 3 && (
            <div>
              <div className='mb-8'>
                <Input.Password
                  clearable
                  bordered
                  aria-label='password'
                  fullWidth
                  value={pwd}
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
                className='mb-4'
                value={confirmPwd}
                helperColor={confirmStatus ? 'default' : 'error'}
                status={confirmStatus ? 'default' : 'error'}
                helperText={confirmStatus ? '' : '密码不一致'}
                onChange={(e) => setConfirmPwd(e.target.value.trim())}
                placeholder='确认密码'
                initialValue=''
              />
              <Button className='w-full' size='lg' onPress={changePwd}>
                修改
              </Button>
            </div>
          )}
          {step === 4 && (
            <div className='px-6 pt-10'>
              <Image src={imageSuccess} className='w-40 mb-10' />
              <Button className='w-full' size='lg' onPress={toUnlock}>
                完成
              </Button>
            </div>
          )}
        </div>
      </div>
    </LayoutThird>
  );
}
