import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GiBee } from 'react-icons/gi';
import { MdPerson, MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdCheckCircle, MdArrowForward, MdDarkMode, MdLightMode, MdAutoAwesome, MdContentCopy } from 'react-icons/md';
import toast from 'react-hot-toast';
import { registerUser } from '../redux/slices/authSlice';
import { toggleTheme } from '../redux/slices/uiSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.auth);
  const { theme } = useSelector((s) => s.ui);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [suggestedPwd, setSuggestedPwd] = useState('');

  const generatePassword = () => {
    const upper  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower  = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const syms   = '!@#$%^&*()_+-=[]{}';
    const all    = upper + lower + digits + syms;
    // Guarantee at least one of each type
    const rand = (str) => str[Math.floor(Math.random() * str.length)];
    const base = [rand(upper), rand(lower), rand(digits), rand(syms)];
    for (let i = 0; i < 10; i++) base.push(rand(all));
    // Fisher-Yates shuffle
    const arr = base.sort(() => Math.random() - 0.5);
    const pwd = arr.join('');
    setSuggestedPwd(pwd);
    setShowPass(true);
    setForm((f) => ({ ...f, password: pwd, confirmPassword: pwd }));
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(suggestedPwd);
    toast.success('Password copied!');
  };

  const getStrength = (pwd) => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };

  const strength = getStrength(form.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor  = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-emerald-400'][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    try {
      await dispatch(registerUser({ name: form.name, email: form.email, password: form.password })).unwrap();
      toast.success('Account created! Welcome to BudgetBee 🎉');
    } catch (err) {
      toast.error(err || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel — green branded ── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-500">
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute -bottom-24 -left-8  w-72 h-72 bg-emerald-900/40 rounded-full" />
        <div className="absolute top-1/3 right-0 w-40 h-40 bg-white/5 rounded-full" />

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
            Start Your<br />
            <span className="text-emerald-200">Financial Journey.</span>
          </h1>
          <p className="text-emerald-100/80 text-base leading-relaxed mb-10 font-medium">
            Join thousands of people who manage their finances smarter — for free, forever.
          </p>

          <div className="space-y-3">
            {[
              'Track daily income & expenses',
              'Set & manage monthly budgets',
              'Visualize spending with charts',
              'Export data to CSV anytime',
              'Multi-currency support',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <MdCheckCircle className="text-emerald-300 text-lg flex-shrink-0" />
                <span className="text-white/85 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-emerald-200/60 text-sm font-medium">
            No credit card required · Free forever
          </p>
        </div>
      </div>

      {/* ── Right Panel — form ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto relative">
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
        <div className="w-full max-w-md py-6">

          {/* Mobile logo */}
          <div className="text-center mb-6 lg:hidden">
            <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3">
              <GiBee className="text-2xl text-white" />
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Create Account</h2>
            <p className="text-gray-400 dark:text-gray-500 mb-7 text-sm font-medium">Get started with BudgetBee for free</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <MdPerson className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

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
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  >
                    <MdAutoAwesome className="text-sm" /> Suggest strong password
                  </button>
                </div>
                <div className="relative">
                  <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={(e) => { setForm({ ...form, password: e.target.value }); setSuggestedPwd(''); }}
                    className="input-field pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
                {suggestedPwd && (
                  <div className="mt-2 flex items-center justify-between gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/40 rounded-xl">
                    <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300 truncate">{suggestedPwd}</span>
                    <button
                      type="button"
                      onClick={copyPassword}
                      className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 transition-colors"
                    >
                      <MdContentCopy className="text-sm" /> Copy
                    </button>
                  </div>
                )}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-gray-200 dark:bg-gray-600'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 font-semibold">{strengthLabel} password</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">Confirm Password</label>
                <div className="relative">
                  <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="password"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-base mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>Create Account <MdArrowForward /></>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-gray-800 px-3 text-xs text-gray-400 font-semibold">Already have an account?</span>
              </div>
            </div>

            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-emerald-200 text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-colors dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
            >
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
