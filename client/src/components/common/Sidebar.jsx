import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MdDashboard, MdReceipt, MdBarChart, MdAccountBalanceWallet,
  MdPerson, MdSettings, MdLogout, MdCategory,
} from 'react-icons/md';
import { GiBee } from 'react-icons/gi';
import { logout } from '../../redux/slices/authSlice';

const navItems = [
  { to: '/dashboard',    icon: MdDashboard,          label: 'Dashboard' },
  { to: '/transactions', icon: MdReceipt,            label: 'Transactions' },
  { to: '/analytics',   icon: MdBarChart,            label: 'Analytics' },
  { to: '/budget',      icon: MdAccountBalanceWallet, label: 'Budget' },
  { to: '/categories',  icon: MdCategory,            label: 'Categories' },
  { to: '/profile',     icon: MdPerson,              label: 'Profile' },
  { to: '/settings',    icon: MdSettings,            label: 'Settings' },
];

const Sidebar = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { sidebarOpen } = useSelector((s) => s.ui);
  const { user }  = useSelector((s) => s.auth);
  const handleLogout = () => { dispatch(logout()); navigate('/login'); };
  const isExpanded   = sidebarOpen;

  return (
    <aside
      className={`
        hidden lg:flex
        fixed left-0 top-0 h-full flex-col z-30
        bg-white dark:bg-gray-950
        border-r border-gray-200 dark:border-white/5 shadow-md dark:shadow-none
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-60' : 'w-[72px]'}
      `}
    >
      {/* Logo */}
      <NavLink to="/dashboard" className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100 dark:border-white/5 ${!isExpanded && 'justify-center'}`}>
        <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
          <GiBee className="text-white text-lg" />
        </div>
        {isExpanded && (
          <div>
            <span className="font-display font-bold text-gray-900 dark:text-white text-base tracking-tight">BudgetBee</span>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-widest">Finance Tracker</p>
          </div>
        )}
      </NavLink>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {isExpanded && (
          <p className="text-[10px] text-gray-400 dark:text-gray-600 font-semibold uppercase tracking-widest px-3 mb-2 mt-1">Menu</p>
        )}
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm
              transition-all duration-150 group relative
              ${!isExpanded ? 'justify-center' : ''}
              ${isActive
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-gray-200'
              }
            `}
            title={!isExpanded ? label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-500 dark:bg-emerald-400 rounded-r-full" />
                )}
                <Icon className={`text-[18px] flex-shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-600 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                {isExpanded && <span className="font-medium">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info + Logout */}
      <div className="p-3 border-t border-gray-100 dark:border-white/5 space-y-1">
        {/* User info card */}
        {user && (
          <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 mb-1 ${!isExpanded && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                : user.name?.charAt(0).toUpperCase()
              }
            </div>
            {isExpanded && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">{user.name}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate font-medium">{user.email}</p>
              </div>
            )}
          </div>
        )}
        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-gray-400 dark:text-gray-600 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-all duration-150 text-sm font-medium ${!isExpanded ? 'justify-center' : ''}`}
          title={!isExpanded ? 'Sign Out' : undefined}
        >
          <MdLogout className="text-[18px] flex-shrink-0" />
          {isExpanded && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
