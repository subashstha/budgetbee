import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import TransactionModal from '../TransactionModal';

const Layout = () => {
  const { sidebarOpen, activeModal } = useSelector((state) => state.ui);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'lg:ml-60' : 'lg:ml-[72px]'}`}>
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24 md:px-6 md:pt-6 lg:pb-6">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />

      {activeModal === 'transaction' && <TransactionModal />}
    </div>
  );
};

export default Layout;
