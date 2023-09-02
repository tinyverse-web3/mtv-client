import { useCallback } from 'react';
import { createMemo, useEvent, useList } from 'react-use';

const fibonacci: any = (n: any) => {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
};
const useMemoFibonacci = createMemo(fibonacci);

// import EthCrypto from 'eth-crypto';
export default function Test() {
  const test = async () => {
  };
  const test2 = async () => {
  };

  return (
    <div>
      <div onClick={test}>Test</div>
      <div onClick={test2}>Test2</div>
      {/* <QRCode 
      size={256}
      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
      value={"https://www.baidu.com"}
      viewBox={`0 0 256 256`}
      /> */}
    </div>
  );
}
