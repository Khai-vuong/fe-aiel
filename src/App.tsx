import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './routers/Layout';
import Homepage from './pages/Homepage';
import Login from './Domains/user/pages/Login';
import Register from './Domains/user/pages/Register';
import CourseRegister from './pages/CourseRegister';
// import StudentProfile from './pages/StudentProfile';

// import StudentProfile from './Domains/user/pages/StudentProfile';

import StudentProfile from './Domains/user/pages/UserProfile';
import InstructorDashboard from './pages/InstructorDashboard';
import ChatPage from './pages/ChatPage';
import TakeQuiz from './pages/TakeQuiz';
import QuizList from './pages/QuizList'; // ← trang danh sách quiz

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

      // ⭐ NHẤN QUIZ TRÊN HEADER SẼ ĐI VÀO ĐÂY
      { path: 'quiz', element: <QuizList /> },

      // ⭐ KHI CHỌN 1 QUIZ → LÀM BÀI
      { path: 'take-quiz', element: <TakeQuiz /> },
      { path: 'instructor/dashboard', element: <InstructorDashboard /> },
      { path: 'chat', element: <ChatPage /> },
    ],
  },


]);

export default function App() {
  return <RouterProvider router={router} />;
}
