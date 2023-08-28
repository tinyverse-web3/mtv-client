import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useCountDown(initCount = 10, initText?: string) {
  const { t } = useTranslation();
  initText = initText || t('common.code_text');
  const timeId = useRef<number>(0);
  const [flag, setFlag] = useState(true);
  const [count, setCount] = useState(initCount);
  const [text, setText] = useState(initText);

  const start = () => {
    if (!flag) return;
    setFlag(false);
    setCount((count) => count - 1);
    timeId.current = window.setInterval(() => {
      setCount((count) => count - 1);
    }, 1000);
  };

  const reset = () => {
    window.clearInterval(timeId.current);
    setCount(initCount);
    setText(initText);
    setFlag(true);
  };

  useEffect(() => window.clearInterval(timeId.current), []);

  useEffect(() => {
    if (count === initCount) {
      setText(initText);
    } else if (count === 0) {
      setFlag(true);
      setCount(initCount);
      clearInterval(timeId.current);
      setText(initText);
    } else {
      setText(`${count}s`);
    }
  }, [count]);

  return { start, count, text, flag, reset };
}
