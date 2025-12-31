import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import React from 'react';
import Homepage from '@/pages/Homepage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: React.createElement(Layout),
    children: [
      {
        index: true,
        element: React.createElement(Homepage),
      },
    ],
  },
]);
