import MainLayout from '@/components/layouts/main';
import { ThemeLayout } from '@/components/layouts/theme';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
          <ReactQueryDevtools initialIsOpen={true} />
        </ThemeLayout>
      </LazyMotion>
    </div>
  );
};

export const Route = createRootRoute({
  component: rootComponent,
});
