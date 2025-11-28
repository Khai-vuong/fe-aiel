import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './routers/Layout';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseRegister from './pages/CourseRegister';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: 'courses/register',
    element: <CourseRegister />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
