import { lazy, Suspense } from 'react';
const Main = lazy(() => import('@/pages/main'));

export default [
  {
    path: 'main',
    element: <Main />,
  },
];
