import styles from './index.module.scss';
import { Outlet } from '@tanstack/react-router';
import Sidebar from '@/components/frames/sidebar';

const MainLayout = () => {
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.wrap}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
