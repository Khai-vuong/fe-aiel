import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import React from 'react';
import Homepage from '@/pages/Homepage';
import AdminCourses from '@/Domains/course/pages/AdminCourses';

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
        element: React.createElement(AdminCourses),
      },
    ],
  },
]);
