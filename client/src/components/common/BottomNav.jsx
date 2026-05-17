import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  MdDashboard, MdReceipt, MdBarChart,
  MdAccountBalanceWallet, MdAdd,
} from 'react-icons/md';
import { openModal, setEditingTransaction } from '../../redux/slices/uiSlice';

const leftItems = [
  { to: '/dashboard',    icon: MdDashboard, label: 'Home' },
  { to: '/transactions', icon: MdReceipt,   label: 'Txns' },
];

const rightItems = [
  { to: '/analytics', icon: MdBarChart,             label: 'Analytics' },
  { to: '/budget',    icon: MdAccountBalanceWallet, label: 'Budget' },
];

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink to={to} className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2">
    {({ isActive }) => (
      <>
        <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
          isActive ? 'bg-emerald-50 dark:bg-emerald-500/15' : ''
        }`}>
          <Icon className={`text-[22px] transition-colors duration-200 ${
            isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'
          }`} />
        </div>
        <span className={`text-[10px] font-semibold leading-none transition-colors duration-200 ${
          isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'
        }`}>
          {label}
        </span>
      </>
    )}
  </NavLink>
);

const BottomNav = () => {
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(setEditingTransaction(null));
    dispatch(openModal('transaction'));
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30">
      {/* Curved bar */}
      <div className="absolute inset-0 bg-white dark:bg-gray-950 rounded-t-[32px] shadow-[0_-4px_24px_rgba(0,0,0,0.07)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)]" />

      {/* Items row */}
      <div className="relative flex items-center h-[68px]">
        {leftItems.map((item) => <NavItem key={item.to} {...item} />)}

        {/* Center gap for FAB */}
        <div className="w-20 flex-shrink-0" />

        {rightItems.map((item) => <NavItem key={item.to} {...item} />)}
      </div>

      {/* Raised FAB */}
      <button
        onClick={handleAdd}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-5 w-[60px] h-[60px] bg-gradient-primary rounded-2xl shadow-xl shadow-emerald-500/40 flex items-center justify-center active:scale-90 transition-transform duration-150"
        aria-label="Add transaction"
      >
        <MdAdd className="text-white text-[30px]" />
      </button>
    </nav>
  );
};

export default BottomNav;
