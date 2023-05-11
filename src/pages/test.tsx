import { useCallback } from 'react';
import { createMemo, useEvent, useList } from 'react-use';
import { MtvCrypto, MtvStorage } from '@/lib/account';

const fibonacci: any = (n: any) => {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
};
import { GreeterClient } from '@/api/grpc/demo.client';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
const useMemoFibonacci = createMemo(fibonacci);

// import { ethers } from 'ethers';
// import EthCrypto from 'eth-crypto';
export default function Test() {
  const test = async () => {
    const privateKey =
      '6d26323e54ee98139c1ade27c29c08dc7ec17606bc0d90ac9f81240aaddce579';
    const crypt = new MtvCrypto(privateKey);
    const storage = new MtvStorage(privateKey, crypt);
    await storage.init();
    await storage.put('test', 1);
    const data = await storage.get('test');
    console.log('put key2');
    await storage.put('abc', { a: 1, b: 5 });
    const data2 = await storage.get('abc');
    await storage.connect();
    console.log(data);
    console.log(data2);
  };
  const test2 = async () => {
    const privateKey =
      '6d26323e54ee98139c1ade27c29c08dc7ec17606bc0d90ac9f81240aaddce579';
    const crypt = new MtvCrypto(privateKey);
    const storage = new MtvStorage(privateKey, crypt);
    await storage.init();
    await storage.connect();
    await storage.resume();
    // await storage.put('test', 1);
    const data = await storage.get('test');
    console.log('get key2');
    // await storage.put('abc', { a: 1, b: 2 });
    const data2 = await storage.get('abc');
    console.log(data);
    console.log(data2);
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
