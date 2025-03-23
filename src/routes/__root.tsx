import MainLayout from '@/components/layouts/main';
import { ThemeLayout } from '@/components/layouts/theme';
import { createRootRoute } from '@tanstack/react-router';
import { domAnimation, LazyMotion } from 'framer-motion';

const rootComponent = () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    const newUserId = crypto.randomUUID();
    localStorage.setItem('userId', newUserId);
  }

  return (
    <div>
      <LazyMotion features={domAnimation}>
        <ThemeLayout>
          <MainLayout />
        </ThemeLayout>
      </LazyMotion>
    </div>
  );
};

export const Route = createRootRoute({
  component: rootComponent,
});
