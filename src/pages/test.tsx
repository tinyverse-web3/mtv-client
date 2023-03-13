import { useCallback } from 'react';
import QRCode from 'react-qr-code';
import { createMemo, useEvent, useList } from 'react-use';

 const fibonacci:any = (n:any) => {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

const useMemoFibonacci = createMemo(fibonacci);

// import { ethers } from 'ethers';
// import EthCrypto from 'eth-crypto';
export default function Test() {
  const [list, {push, clear}] = useList();

  const onKeyDown = useCallback((key:any) => {
    if (key === 'r') clear();
    push(key);
  }, []);

  useEvent('keydown', onKeyDown);

  // return (
  //   <div>
  //     <p>
  //       Press some keys on your keyboard, <code style={{color: 'tomato'}}>r</code> key resets the list
  //     </p>
  //     <pre>
  //       {JSON.stringify(list, null, 4)}
  //     </pre>
  //   </div>
  // );

  return (
    <div >
      <QRCode 
      size={256}
      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
      value={"https://www.baidu.com"}
      viewBox={`0 0 256 256`}
      />
    </div>
  )
}
