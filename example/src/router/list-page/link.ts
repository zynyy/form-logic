import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import lazyLoader from '@/router/lazyLoader';

const LinkRoute: RouteObject[] = [
  {
    path: '/link',
    element: lazyLoader(lazy(() => import('@/pages//link'))),
  },

  {
    path: '/link/create',
    element: lazyLoader(lazy(() => import('@/pages/link/LinkCreate'))),
  },

  {
    path: '/link/edit',
    element: lazyLoader(lazy(() => import('@/pages/link/LinkEdit'))),
  },

  {
    path: '/link/detail',
    element: lazyLoader(lazy(() => import('@/pages/link/LinkDetail'))),
  },
];

export default LinkRoute;
