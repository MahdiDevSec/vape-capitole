import { Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import AnimatedBackground from '../components/AnimatedBackground';

const Layout = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <AnimatedBackground />
      <Navbar />
      <main className="flex-grow relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <Outlet />
        </div>
      </main>
      <Footer />

    </div>
  );
};

export default Layout;


