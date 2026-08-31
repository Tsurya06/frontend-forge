import { Outlet } from 'react-router-dom';
import { Layout as BaseLayout } from '@/components/layout/Layout';

export default function Layout() {
  return (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  );
}
