import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MdDarkMode, MdLightMode, MdNotifications, MdDelete,
  MdDownload, MdInfo, MdArrowForward,
} from 'react-icons/md';
import { GiBee as FaBee } from 'react-icons/gi';
import toast from 'react-hot-toast';
import { toggleTheme } from '../redux/slices/uiSlice';
import { updateProfile, logout } from '../redux/slices/authSlice';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { theme } = useSelector((s) => s.ui);
  const [notifications, setNotifications] = useState(user?.notifications || { email: true, budgetAlert: true });
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleNotificationChange = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    try {
      await dispatch(updateProfile({ notifications: updated })).unwrap();
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/users/account');
      dispatch(logout());
      navigate('/');
      toast.success('Account deleted');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  const Section = ({ icon: Icon, title, children }) => (
    <div className="card p-5">
      <h3 className="font-serif font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Icon className="text-primary-500 text-xl" /> {title}
      </h3>
      {children}
    </div>
  );

  const Toggle = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-600'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      {/* Appearance */}
      <Section icon={theme === 'dark' ? MdDarkMode : MdLightMode} title="Appearance">
        <Toggle
          label="Dark Mode"
          desc="Switch between light and dark theme"
          checked={theme === 'dark'}
          onChange={() => dispatch(toggleTheme())}
        />
        <div className="flex gap-3 mt-4">
          {['light', 'dark'].map((t) => (
            <button
              key={t}
              onClick={() => theme !== t && dispatch(toggleTheme())}
              className={`flex-1 py-3 rounded-xl border-2 transition-all capitalize font-medium text-sm ${theme === t ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'border-gray-200 dark:border-gray-600 text-gray-500'}`}
            >
              {t === 'light' ? '☀️' : '🌙'} {t}
            </button>
          ))}
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={MdNotifications} title="Notifications">
        <Toggle
          label="Email Notifications"
          desc="Receive updates and alerts via email"
          checked={notifications.email}
          onChange={() => handleNotificationChange('email')}
        />
        <Toggle
          label="Budget Alerts"
          desc="Get notified when approaching budget limits"
          checked={notifications.budgetAlert}
          onChange={() => handleNotificationChange('budgetAlert')}
        />
      </Section>

      {/* Data & Export */}
      <Section icon={MdDownload} title="Data & Export">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Export your transactions as CSV, Excel, PDF, or PNG from the Transactions page.
        </p>
        <Link
          to="/transactions"
          className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
              <MdDownload className="text-emerald-600 dark:text-emerald-400 text-lg" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Go to Transactions</p>
              <p className="text-[11px] text-gray-400">CSV · Excel · PDF · PNG</p>
            </div>
          </div>
          <MdArrowForward className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
        </Link>
      </Section>

      {/* App Info */}
      <Section icon={MdInfo} title="About BudgetBee">
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3">
            <FaBee className="text-2xl text-white" />
          </div>
          <h4 className="font-serif font-bold text-gray-800 dark:text-gray-100">BudgetBee</h4>
          <p className="text-gray-400 text-sm">v1.0.0 — Daily Expense Tracker</p>
          <p className="text-xs text-gray-400 mt-3 max-w-xs mx-auto">
            Built with React, Node.js, MongoDB. Track your finances, set budgets, and achieve financial freedom.
          </p>
        </div>
      </Section>

      {/* Danger Zone */}
      <div className="card p-5 border-2 border-red-200 dark:border-red-900/50">
        <h3 className="font-bold text-red-500 mb-4 flex items-center gap-2">
          <MdDelete className="text-xl" /> Danger Zone
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Deleting your account will permanently remove all your data. This action cannot be undone.
        </p>
        <button onClick={() => setDeleteConfirm(true)} className="btn-danger text-sm">Delete My Account</button>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="card p-6 max-w-sm w-full animate-slide-up text-center">
            <div className="text-5xl mb-3">⚠️</div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2 text-lg">Delete Account?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
              This will permanently delete all your transactions, budgets, and account data. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleDeleteAccount} className="btn-danger flex-1">Delete Forever</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
