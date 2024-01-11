import { lazy, Suspense } from 'react';

const Main = lazy(() => import('@/pages/main'));
const Warpath = lazy(() => import('@/pages/warpath'));

export default [
  {
    path: 'main',
    element: <Main />,
  },
  {
    path: 'warpath',
    element: <Warpath />,
  },
];
