import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Outlet />
        </div>
      </main>
      <Footer />
      <Cart />
    </div>
  );
};

export default Layout;
