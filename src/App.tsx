import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './routers/Layout';
import Homepage from './pages/Homepage';
import Login from './Domains/user/pages/Login';
import Register from './Domains/user/pages/Register';
import CourseRegister from './pages/CourseRegister';
import NewCourseRegister from './pages/NewCourseRegister';
import UserProfile from './Domains/user/pages/UserProfile';
import InstructorDashboard from './Domains/class/pages/InstructorDashboard';
import ChatPage from './pages/ChatPage';
import TakeQuiz from './pages/TakeQuiz'; // Kiểm tra file này có đúng ở src/pages không nhé

// ⭐ CẬP NHẬT ĐƯỜNG DẪN IMPORT ĐÚNG
import QuizList from './Domains/quiz/pages/QuizList';

import ClassesCatalog from './Domains/class/pages/classesCatalog';
import ClassDetail from './Domains/class/pages/classDetail';
import EditClass from './Domains/class/pages/EditClass';
import QuizAdd from './Domains/quiz/pages/QuizAdd';
import FileAdd from './Domains/quiz/pages/FileAdd';
import AdminCourses from './Domains/course/pages/AdminCourses';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'courses/register', element: <CourseRegister /> },
      { path: 'courses/new', element: <NewCourseRegister /> },

      { path: 'courses/catalog', element: <AdminCourses /> },

      { path: 'student/profile', element: <UserProfile /> },
      { path: 'classes/me', element: <ClassesCatalog /> },

      // --- CÁC ROUTE CỦA CLASS ---
      { path: 'class/:clid', element: <ClassDetail /> },
      { path: 'class/:clid/edit', element: <EditClass /> },
      { path: 'class/:clid/monitor', element: <InstructorDashboard /> },
      { path: 'class/:clid/fileAdd', element: <FileAdd /> },
      { path: 'class/:clid/quizAdd', element: <QuizAdd /> },

      // Route hiển thị danh sách Quiz theo lớp
      { path: 'class/:clid/quizzes', element: <QuizList /> },

      // Route làm bài thi nhận Attempt ID (atid)
      { path: 'take-quiz/:atid', element: <TakeQuiz /> },

      { path: 'instructor/dashboard', element: <InstructorDashboard /> },
      { path: 'chat', element: <ChatPage /> },
    ],
  },
]);

export default function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterProvider router={router} />
    </>
  );
}
