import { useEffect, useRef, useState } from 'react';
export function useCountDown(initCount = 10, initText = '获取验证码') {
  const timeId = useRef<{ id: number }>({ id: 0 });
  const [flag, setFlag] = useState(true);
  const [count, setCount] = useState(initCount);
  const [text, setText] = useState(initText);
  const start = () => {
    if (!flag) return;
    setFlag(false);
    setCount((count) => count - 1);
    timeId.current.id = window.setInterval(() => {
      setCount((count) => count - 1);
    }, 1000);
  };
  useEffect(() => window.clearInterval(timeId.current.id), []);
  useEffect(() => {
    if (count === initCount) {
      setText(initText);
    } else if (count === 0) {
      setFlag(true);
      clearInterval(timeId.current.id);
      setText(initText);
    } else {
      setText(`${count}s`);
    }
  }, [count]);
  return { start, count, text, flag };
}
