import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { MdMenu, MdDarkMode, MdLightMode, MdAdd } from 'react-icons/md';
import { GiBee } from 'react-icons/gi';
import { toggleSidebar, toggleTheme, openModal, setEditingTransaction } from '../../redux/slices/uiSlice';
import { updateProfile, updateUserLocal } from '../../redux/slices/authSlice';
import { CURRENCIES } from '../../utils/formatters';
import CustomSelect from './CustomSelect';

const pageTitles = {
  '/dashboard':    { title: 'Dashboard',    subtitle: 'Your financial overview' },
  '/transactions': { title: 'Transactions', subtitle: 'Manage income & expenses' },
  '/analytics':    { title: 'Analytics',    subtitle: 'Visualize spending habits' },
  '/budget':       { title: 'Budget',       subtitle: 'Track monthly budgets' },
  '/profile':      { title: 'Profile',      subtitle: 'Account details' },
  '/settings':     { title: 'Settings',     subtitle: 'App preferences' },
};

const Navbar = () => {
  const dispatch  = useDispatch();
  const { theme } = useSelector((s) => s.ui);
  const { user }  = useSelector((s) => s.auth);
  const location  = useLocation();
  const page      = pageTitles[location.pathname] || { title: 'BudgetBee', subtitle: '' };

  const currentCurrency = user?.currency || 'NPR';

  const handleCurrencyChange = (currency) => {
    dispatch(updateUserLocal({ currency }));
    dispatch(updateProfile({ name: user?.name, currency }));
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 md:px-6 h-14 flex items-center justify-between flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile logo */}
        <Link to="/dashboard" className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center shadow-sm">
            <GiBee className="text-white text-base" />
          </div>
          <span className="font-display font-bold text-gray-900 dark:text-white text-sm tracking-tight">BudgetBee</span>
        </Link>

        {/* Desktop hamburger */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="hidden lg:flex p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <MdMenu className="text-xl" />
        </button>

        {/* Desktop page title */}
        <div className="hidden lg:block">
          <h2 className="font-display font-bold text-gray-900 dark:text-white text-base leading-none">{page.title}</h2>
          {page.subtitle && <p className="text-[11px] text-gray-400 font-medium mt-0.5 leading-none">{page.subtitle}</p>}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => { dispatch(setEditingTransaction(null)); dispatch(openModal('transaction')); }}
          className="btn-primary items-center gap-1.5 text-sm px-4 py-2 hidden lg:flex"
        >
          <MdAdd className="text-lg" />
          Add Transaction
        </button>

        {/* Currency switcher */}
        <CustomSelect
          value={currentCurrency}
          onChange={handleCurrencyChange}
          options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} ${c.symbol}` }))}
          className="w-[100px]"
          compact
        />

        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        >
          {theme === 'dark'
            ? <MdLightMode className="text-xl text-amber-400" />
            : <MdDarkMode className="text-xl" />
          }
        </button>

        {/* User chip */}
        <div className="hidden md:flex items-center gap-2 pl-2 ml-1 border-l border-gray-100 dark:border-gray-800">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0 shadow-sm">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              : user?.name?.charAt(0).toUpperCase()
            }
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user?.name?.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
