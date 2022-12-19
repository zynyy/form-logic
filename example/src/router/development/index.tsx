import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import lazyLoader from '@/router/lazyLoader';

const DevelopmentRoute: RouteObject[] = [
  {
    path: 'development/component',
    element: lazyLoader(lazy(() => import('@/pages/development/component'))),
    children: [
      {
        path: 'development/component/create',
        element: lazyLoader(lazy(() => import('@/pages/development/component/ComponentCreate'))),
      },
      {
        path: 'development/component/detail',
        element: lazyLoader(lazy(() => import('@/pages/development/component/ComponentDetail'))),
      },
      {
        path: 'development/component/edit',
        element: lazyLoader(lazy(() => import('@/pages/development/component/ComponentEdit'))),
      },
    ],
  },

  {
    path: 'development/meta',
    element: lazyLoader(lazy(() => import('@/pages/development/meta'))),
    children: [
      {
        path: 'development/meta/create',
        element: lazyLoader(lazy(() => import('@/pages/development/meta/MetaCreate'))),
      },
      {
        path: 'development/meta/detail',
        element: lazyLoader(lazy(() => import('@/pages/development/meta/MetaDetail'))),
      },
      {
        path: 'development/meta/edit',
        element: lazyLoader(lazy(() => import('@/pages/development/meta/MetaEdit'))),
      },
    ],
  },

  {
    path: 'development/model',
    element: lazyLoader(lazy(() => import('@/pages/development/model'))),
    children: [
      {
        path: 'development/model/create',
        element: lazyLoader(lazy(() => import('@/pages/development/model/ModelCreate'))),
      },
      {
        path: 'development/model/detail',
        element: lazyLoader(lazy(() => import('@/pages/development/model/ModelDetail'))),
      },
      {
        path: 'development/model/edit',
        element: lazyLoader(lazy(() => import('@/pages/development/model/ModelEdit'))),
      },
    ],
  },

  {
    path: 'development/logic',
    element: lazyLoader(lazy(() => import('@/pages/development/logic'))),
    children: [
      {
        path: 'development/logic/create',
        element: lazyLoader(lazy(() => import('@/pages/development/logic/LogicCreate'))),
      },
      {
        path: 'development/logic/detail',
        element: lazyLoader(lazy(() => import('@/pages/development/logic/LogicDetail'))),
      },
      {
        path: 'development/logic/edit',
        element: lazyLoader(lazy(() => import('@/pages/development/logic/LogicEdit'))),
      },
    ],
  },

  {
    path: 'development/page-config',
    element: lazyLoader(lazy(() => import('@/pages/development/page-config'))),
    children: [
      {
        path: 'development/page-config/create',
        element: lazyLoader(lazy(() => import('@/pages/development/page-config/PageConfigCreate'))),
      },
      {
        path: 'development/page-config/detail',
        element: lazyLoader(lazy(() => import('@/pages/development/page-config/PageConfigDetail'))),
      },
      {
        path: 'development/page-config/edit',
        element: lazyLoader(lazy(() => import('@/pages/development/page-config/PageConfigEdit'))),
      },
    ],
  },
];

export default DevelopmentRoute;
