import { useCallback } from 'react';
import { createMemo, useEvent, useList } from 'react-use';
// import { AppAccount } from '@/lib/account';

// import { ethers } from 'ethers';
// import EthCrypto from 'eth-crypto';
export default function App() {
  const test = async () => {
    // const app = new AppAccount();
    // await app.sendVerifyCode({ account: '18098922101@189.cn' });
  };

  return (
    <div>
      <div onClick={test}>Test</div>
    </div>
  );
}
