import { lazy, Suspense } from 'react';


const Warpath = lazy(() => import('@/pages/warpath'));

export default [

  {
    path: 'warpath',
    element: <Warpath />,
  },
];
