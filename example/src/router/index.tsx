import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import BasicLayout from '@/layouts/BasicLayout';
import main from './main';



// @ts-ignore
const routers = createBrowserRouter(
  [
    {
      path: '/',
      element: <BasicLayout />,
      children: [...main],
    },
  ],
  {},
);

export default routers;
