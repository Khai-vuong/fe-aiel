import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AiChatSidebar from '../components/AiChatSidebar';

export default function Layout() {
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);

  const toggleAiSidebar = () => {
    setIsAiSidebarOpen((current) => !current);
  };

  return (
    <>
      <div
        className="transition-[padding-right] duration-300 ease-out"
        style={{ paddingRight: isAiSidebarOpen ? '420px' : '0px' }}
      >
        <Header onToggleAiSidebar={toggleAiSidebar} />
        <Outlet />
        <Footer />
      </div>
      <AiChatSidebar
        isOpen={isAiSidebarOpen}
        onClose={() => setIsAiSidebarOpen(false)}
      />
    </>
  );
}
