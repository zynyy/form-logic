import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

import lazyLoader from '@/router/lazyLoader';

const DevelopmentRoute: RouteObject[] = [
  {
    path: 'development/component',
    element: lazyLoader(lazy(() => import('@/pages/development/component'))),
  },
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

  {
    path: 'development/field-meta',
    element: lazyLoader(lazy(() => import('@/pages/development/field-meta'))),
  },
  {
    path: 'development/field-meta/create',
    element: lazyLoader(lazy(() => import('@/pages/development/field-meta/MetaCreate'))),
  },
  {
    path: 'development/field-meta/detail',
    element: lazyLoader(lazy(() => import('@/pages/development/field-meta/MetaDetail'))),
  },
  {
    path: 'development/field-meta/edit',
    element: lazyLoader(lazy(() => import('@/pages/development/field-meta/MetaEdit'))),
  },

  {
    path: 'development/model',
    element: lazyLoader(lazy(() => import('@/pages/development/model'))),
  },
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

  {
    path: 'development/logic',
    element: lazyLoader(lazy(() => import('@/pages/development/logic'))),
  },
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

  {
    path: 'development/model-page',
    element: lazyLoader(lazy(() => import('@/pages/development/model-page'))),
  },
  {
    path: 'development/model-page/create',
    element: lazyLoader(lazy(() => import('@/pages/development/model-page/ModelPageCreate'))),
  },
  {
    path: 'development/model-page/detail',
    element: lazyLoader(lazy(() => import('@/pages/development/model-page/ModelPageDetail'))),
  },
  {
    path: 'development/model-page/edit',
    element: lazyLoader(lazy(() => import('@/pages/development/model-page/ModelPageEdit'))),
  },
];

export default DevelopmentRoute;
