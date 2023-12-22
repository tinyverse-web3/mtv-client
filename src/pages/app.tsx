import {NextUIProvider} from "@nextui-org/react";

// import EthCrypto from 'eth-crypto';
export default function App() {
  
  const test = async () => {
    // const app = new AppAccount();
    // await app.sendVerifyCode({ account: '18098922101@189.cn' });
  };

  return (
    <NextUIProvider>
      <div onClick={test}>Test</div>
    </NextUIProvider>
  );
}
