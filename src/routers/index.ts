import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import React from 'react';
import Homepage from '@/pages/Homepage';
import AdminSystem from '@/Domains/course/pages/AdminSystem';

export const router = createBrowserRouter([
  {
    path: '/',
    element: React.createElement(Layout),
    children: [
      {
        index: true,
        element: React.createElement(Homepage),
      },
      {
        path: '/admin/dashboard',
        element: React.createElement(AdminSystem),
      },
    ],
  },
]);
