import PageLoading from '@/components/page-loading';

import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import './assets/css/App.css';

import router from './router';

const App = () => (
  <Suspense fallback={<PageLoading />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default App;
