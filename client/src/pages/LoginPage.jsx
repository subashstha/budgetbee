import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GiBee } from 'react-icons/gi';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdArrowForward, MdDarkMode, MdLightMode } from 'react-icons/md';
import toast from 'react-hot-toast';
import { loginUser } from '../redux/slices/authSlice';
import { toggleTheme } from '../redux/slices/uiSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.auth);
  const { theme } = useSelector((s) => s.ui);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(form)).unwrap();
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel — green branded ── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-500">
        {/* decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-emerald-900/40 rounded-full" />
        <div className="absolute top-1/2 right-0 w-48 h-48 bg-white/5 rounded-full" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
            <GiBee className="text-white text-xl" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">BudgetBee</span>
        </div>

        {/* Center content */}
        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
            Welcome Back!<br />
            <span className="text-emerald-200">Good to see you.</span>
          </h1>
          <p className="text-emerald-100/80 text-base leading-relaxed mb-10 font-medium">
            Sign in to continue tracking your expenses and stay on top of your financial goals.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Transactions', value: '1,200+' },
              { label: 'Categories',   value: '13' },
              { label: 'Reports',      value: 'Monthly' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-emerald-200 mt-0.5 font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative">
          <p className="text-emerald-200/60 text-sm font-medium">
            Trusted by 50,000+ users worldwide
          </p>
        </div>
      </div>

      {/* ── Right Panel — form ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 relative">
        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        >
          {theme === 'dark'
            ? <MdLightMode className="text-xl text-amber-400" />
            : <MdDarkMode className="text-xl" />
          }
        </button>
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3">
              <GiBee className="text-2xl text-white" />
            </div>
            <p className="font-bold text-gray-900 dark:text-white text-xl">BudgetBee</p>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Sign In</h2>
            <p className="text-gray-400 dark:text-gray-500 mb-7 text-sm font-medium">Enter your credentials to continue</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">Email</label>
                <div className="relative">
                  <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Password</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>Sign In <MdArrowForward /></>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-gray-800 px-3 text-xs text-gray-400 font-semibold">New to BudgetBee?</span>
              </div>
            </div>

            <Link
              to="/register"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-emerald-200 text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-colors dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
            >
              Create a Free Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
