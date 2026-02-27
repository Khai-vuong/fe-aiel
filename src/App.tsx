import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './routers/Layout';

// --- Pages Imports ---
import Homepage from './pages/Homepage';
import Login from './Domains/user/pages/Login';
import Register from './Domains/user/pages/Register';
import CourseRegister from './pages/CourseRegister';
import NewCourseRegister from './pages/NewCourseRegister';
import UserProfile from './Domains/user/pages/UserProfile';
import InstructorDashboard from './Domains/class/pages/InstructorDashboard';
import ChatPage from './pages/ChatPage';

// --- Quiz Imports ---
import TakeQuiz from './Domains/quiz/pages/TakeQuiz';
import QuizList from './Domains/quiz/pages/QuizList';
import QuizDetail from './Domains/quiz/pages/QuizDetail';
import QuizCreate from './Domains/quiz/pages/QuizCreate';
import QuizResult from './Domains/quiz/pages/QuizResult';
// ❌ Đã xóa import QuizEdit để fix lỗi trắng màn hình
// import QuizEdit from './Domains/quiz/pages/QuizEdit';

// --- Class Imports ---
import ClassesCatalog from './Domains/class/pages/classesCatalog';
import ClassDetail from './Domains/class/pages/classDetail';
import EditClass from './Domains/class/pages/EditClass';
import FileAdd from './Domains/quiz/pages/FileAdd';
import AdminSystem from './Domains/course/pages/AdminSystem';

// --- Logs Imports ---
import LogPage from './Domains/logs/pages/LogPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },

      // --- Courses ---
      { path: 'courses/register', element: <CourseRegister /> },
      { path: 'courses/new', element: <NewCourseRegister /> },
      { path: 'courses/catalog', element: <AdminSystem /> },

      // --- User ---
      { path: 'student/profile', element: <UserProfile /> },

      // --- Classes ---
      { path: 'classes/me', element: <ClassesCatalog /> },
      { path: 'class/:clid', element: <ClassDetail /> },
      { path: 'class/:clid/edit', element: <EditClass /> },
      { path: 'class/:clid/monitor', element: <InstructorDashboard /> },
      { path: 'class/:clid/fileAdd', element: <FileAdd /> },
      { path: 'class/:clid/logs', element: <LogPage /> },

      // --- QUIZ ROUTES ---

      // 1. Danh sách Quiz
      { path: 'class/:clid/quizzes', element: <QuizList /> },

      // 2. Tạo Quiz mới
      { path: 'class/:clid/quiz/create', element: <QuizCreate /> },

      // 3. ❌ Đã xóa route Edit Quiz tạm thời
      // { path: 'class/:clid/quiz/:qid/edit', element: <QuizEdit /> },

      // 4. Xem chi tiết / Lịch sử làm bài
      { path: 'class/:clid/quiz/:qid', element: <QuizDetail /> },

      // 5. Làm bài thi
      { path: 'take-quiz/:atid', element: <TakeQuiz /> },

      // 6. Kết quả bài thi
      { path: 'quiz-result/:atid', element: <QuizResult /> },

      // --- Other ---
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
