import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { useWalletStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';

import { ROUTE_PATH } from '@/router';
import { useNavigate } from 'react-router-dom';
import { useCheckLogin } from '@/components/BindMail';
import { UserAvatar, ListRow, UserLevel } from './components';

export default function Account() {
  const nav = useNavigate();
  const toChangePwd = () => {
    nav(ROUTE_PATH.CHANGE_PWD);
  };
  const toChangeNickname = async () => {
    const loginStatus = await useCheckLogin();
    if (loginStatus) {
      nav(ROUTE_PATH.ACCOUNT_NAME);
    }
  };
  const toPharse = async () => {
    nav(ROUTE_PATH.ACCOUNT_PHRASE);
  };
  const toQuestion = async () => {
    nav(ROUTE_PATH.ACCOUNT_QUESTION);
  };
  const toProtector = async () => {
    nav(ROUTE_PATH.ACCOUNT_PROTECTOR);
  };
  return (
    <LayoutThird title='我的资料' path={ROUTE_PATH.SPACE_INDEX}>
      <div className='pt-4 px-4 text-14px'>
        <div className='flex'>
          <UserAvatar className='mr-4' />
          <UserLevel />
        </div>

        <ListRow label='名字' value='青龙' onPress={toChangeNickname} />
        <ListRow label='钱包地址' value='青龙' onPress={toChangeNickname} />
        <ListRow label='修改密码' onPress={toChangePwd} />
        <ListRow label='指纹识别' value='未开启' onPress={toChangeNickname} />
        <ListRow label='人脸识别' value='已开启' onPress={toChangeNickname} />
        <ListRow label='备份助记词' onPress={toPharse} />
        <ListRow label='守护者备份' onPress={toProtector} />
        <ListRow label='智能隐私备份' onPress={toQuestion} />
      </div>
    </LayoutThird>
  );
}
