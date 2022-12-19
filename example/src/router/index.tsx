import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import BasicLayout from '@/layouts/BasicLayout';
import main from './main';
import Login from '@/pages/login';

import NotFound from '@/pages/404';

import development from './development';

// @ts-ignore
const routers = createBrowserRouter(
  [
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
      element: <BasicLayout />,
      errorElement: <NotFound />,
      children: [...main, ...development],
    },
  ],
  {},
);

export default routers;
