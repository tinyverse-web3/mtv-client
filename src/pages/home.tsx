import LayoutTwo from '@/layout/LayoutTwo';
import { Outlet } from 'react-router-dom';

export default function Home() {
  return (
    <LayoutTwo>
      <Outlet />
    </LayoutTwo>
  );
}
