import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import lazyLoader from '@/router/lazyLoader';

const ValidateRulesRoute: RouteObject[] = [
  {
    path: '/development/validate-rules',
    element: lazyLoader(lazy(() => import('@/pages//development/validate-rules'))),
  },

  {
    path: '/development/validate-rules/create',
    element: lazyLoader(
      lazy(() => import('@/pages/development/validate-rules/ValidateRulesCreate')),
    ),
  },

  {
    path: '/development/validate-rules/edit',
    element: lazyLoader(lazy(() => import('@/pages/development/validate-rules/ValidateRulesEdit'))),
  },

  {
    path: '/development/validate-rules/detail',
    element: lazyLoader(
      lazy(() => import('@/pages/development/validate-rules/ValidateRulesDetail')),
    ),
  },
];

export default ValidateRulesRoute;
