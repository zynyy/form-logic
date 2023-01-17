import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import lazyLoader from '@/router/lazyLoader';

const ModalRoute: RouteObject[] = [
  {
    path: '/modal',
    element: lazyLoader(lazy(() => import('@/pages//modal'))),
  },
];

export default ModalRoute;
