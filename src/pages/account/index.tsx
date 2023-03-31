import { useState } from 'react';
import { Button, Text, Card } from '@nextui-org/react';
import { useCopyToClipboard } from 'react-use';
import { useWalletStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';
import { QuestionMaintain } from '@/components/Question/QuestionMaintain';
import { ROUTE_PATH } from '@/router';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCheckLogin } from '@/components/BindMail';
import { UserAvatar, ListRow, UserLevel } from './components';
export default function Account() {
  const nav = useNavigate();
  const [pharseVisible, setPharseVisible] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [phrase, setPhrase] = useState<string | undefined>();
  const wallet = useWalletStore((state) => state.wallet);

  const [_, copyToClipboard] = useCopyToClipboard();

  const toChangePwd = () => {
    nav(ROUTE_PATH.CHANGE_PWD);
  };
  const showPharse = () => {
    const _phrase = wallet?.getMnemonic();
    setPhrase(_phrase);
    if (_phrase) {
      copyToClipboard(_phrase);
      if (pharseVisible == true) return;
      setPharseVisible(true);
      setQuestionVisible(false);
      setTimeout(() => {
        setPharseVisible(false);
      }, 1000 * 5);
    }
  };
  const showQuestion = async () => {
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      setQuestionVisible(!questionVisible);
      setPharseVisible(false);
    }
  };
  const toChangeNickname = async () => {
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.USER_NAME);
    }
  };
  const toPharse = async () => {
    nav(ROUTE_PATH.USER_PHRASE);
  };
  return (
    <LayoutThird title='我的资料' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='pt-10 px-4 text-14px'>
        <UserAvatar className='mb-10' />
        <UserLevel />
        <ListRow label='名字' value='青龙' onPress={toChangeNickname} />
        <ListRow label='钱包地址' value='青龙' onPress={toChangeNickname} />
        <ListRow label='修改密码' onPress={toChangeNickname} />
        <ListRow label='指纹识别' value='未开启' onPress={toChangeNickname} />
        <ListRow label='人脸识别' value='已开启' onPress={toChangeNickname} />
        <ListRow label='备份助记词' onPress={toPharse} />
        <ListRow label='守护者备份' onPress={toChangeNickname} />
        <ListRow label='智能隐私备份' onPress={toChangeNickname} />
        {/* <Button
          flat
          className='w-full mb-4'
          size='xl'
          color='error'
          onPress={toChangeNickname}>
          个人信息
        </Button>
        <Button
          flat
          className='w-full mb-4'
          size='xl'
          color='error'
          onPress={toChangePwd}>
          修改密码
        </Button>
        <Button
          flat
          className='w-full mb-4'
          size='xl'
          color='error'
          onPress={showPharse}>
          备份助记词
        </Button>

        {pharseVisible ? (
          <Card className='mb-4'>
            <Card.Body>
              <Text>{phrase}</Text>
            </Card.Body>
          </Card>
        ) : (
          <></>
        )}
        <Button
          flat
          className='w-full mb-6'
          size='xl'
          color='error'
          onPress={showQuestion}>
          安全问题备份
        </Button>
        {questionVisible && <QuestionMaintain />} */}
      </div>
    </LayoutThird>
  );
}
