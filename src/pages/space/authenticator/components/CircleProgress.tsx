import { useMemo } from 'react';
import './circle.css';
interface CircleProgressProps {
  percent: number;
}

export const CircleProgress = ({ percent }: CircleProgressProps) => {
  const len = 189;
  const offset = useMemo(() => {
    return len - (len * percent) / 100;
  }, [percent]);
  return (
    <svg viewBox='0 0 100 100' className='circular-progress'>
      <circle
        className='circle'
        cx='50'
        cy='50'
        r='30'
        strokeDashoffset={offset}
        fill='none'></circle>
    </svg>
  );
};
