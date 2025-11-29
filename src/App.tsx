import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './routers/Layout';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseRegister from './pages/CourseRegister';
import StudentProfile from './pages/StudentProfile';
import InstructorDashboard from './pages/InstructorDashboard';
import ChatPage from './pages/ChatPage';
import TakeQuiz from './pages/TakeQuiz'; // ⬅ thêm vào đây

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'courses/register', element: <CourseRegister /> },
      { path: 'student/profile', element: <StudentProfile /> },
    ],
  },

  { path: 'instructor/dashboard', element: <InstructorDashboard /> },

  { path: 'chat', element: <ChatPage /> },

  { path: 'take-quiz', element: <TakeQuiz /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
