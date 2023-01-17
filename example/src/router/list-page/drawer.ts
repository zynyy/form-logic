import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import lazyLoader from '@/router/lazyLoader';

const DrawerRoute: RouteObject[] = [
  {
    path: '/drawer',
    element: lazyLoader(lazy(() => import('@/pages//drawer'))),
  },
];

export default DrawerRoute;
