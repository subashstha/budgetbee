import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GiBee } from 'react-icons/gi';
import {
  MdBarChart, MdAccountBalanceWallet, MdPieChart,
  MdSecurity, MdDevices, MdCloudDownload,
  MdArrowForward, MdCheckCircle, MdTrendingUp,
  MdDarkMode, MdLightMode,
} from 'react-icons/md';
import { toggleTheme } from '../redux/slices/uiSlice';
import { updateProfile, updateUserLocal } from '../redux/slices/authSlice';
import { fetchRates } from '../redux/slices/exchangeRateSlice';
import { CURRENCIES } from '../utils/formatters';
import CustomSelect from '../components/common/CustomSelect';

const features = [
  { icon: MdBarChart,            title: 'Smart Analytics',     desc: 'Visualize spending with interactive charts and detailed monthly breakdowns.' },
  { icon: MdAccountBalanceWallet, title: 'Budget Control',    desc: 'Set monthly budgets per category and get alerts before you overspend.' },
  { icon: MdPieChart,            title: 'Expense Categories',  desc: 'Organize every transaction by category to see exactly where money goes.' },
  { icon: MdSecurity,            title: 'Bank-Grade Security', desc: 'JWT authentication and bcrypt encryption keep your financial data private.' },
  { icon: MdDevices,             title: 'Any Device',          desc: 'Fully responsive — track your finances from desktop, tablet, or phone.' },
  { icon: MdCloudDownload,       title: 'Export Reports',      desc: 'Download your full transaction history as CSV for accounting or tax filing.' },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '$2M+', label: 'Tracked Monthly' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9★', label: 'User Rating' },
];

const steps = [
  { step: '01', title: 'Create Your Account',   desc: 'Sign up free in under 60 seconds — no credit card required.' },
  { step: '02', title: 'Log Your Transactions', desc: 'Add income and expenses with category, payment method, and notes.' },
  { step: '03', title: 'Set a Monthly Budget',  desc: 'Define spending limits per category and get alerted before you exceed them.' },
  { step: '04', title: 'Analyse & Improve',     desc: 'Use charts and reports to spot patterns and make smarter decisions.' },
];

const testimonials = [
  { name: 'Sarah Mitchell', role: 'Freelance Designer',    text: 'BudgetBee completely transformed how I manage my irregular income. The analytics are incredibly clear.', avatar: 'SM' },
  { name: 'James Thornton', role: 'Software Engineer',     text: "I tried five budgeting apps. None matched BudgetBee's simplicity combined with real depth of features.",  avatar: 'JT' },
  { name: 'Priya Sharma',   role: 'Small Business Owner', text: 'The export feature saves me hours every month. My accountant loves the CSV reports.',                     avatar: 'PS' },
];

/* Uses CSS var(--grid-line) set in index.css — switches with .dark class automatically */
const gridBg = {
  backgroundImage:
    'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
  backgroundSize: '56px 56px',
};

const LandingPage = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((s) => s.ui);
  const { user } = useSelector((s) => s.auth);
  const isDark = theme === 'dark';
  const currentCurrency = user?.currency || 'NPR';

  const handleCurrencyChange = (currency) => {
    dispatch(updateUserLocal({ currency }));
    if (user) dispatch(updateProfile({ name: user.name, currency }));
    dispatch(fetchRates('NPR'));
  };

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const nav = document.querySelector('nav[data-nav]');
    const navH = nav ? nav.getBoundingClientRect().height : 64;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 overflow-x-hidden bg-white dark:bg-gray-950">

      {/* ── Navbar ── */}
      <nav
        data-nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center">
              <GiBee className="text-white text-lg" />
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight">BudgetBee</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500 dark:text-gray-400">
            <a href="#features"     onClick={scrollTo('features')}     className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Features</a>
            <a href="#how-it-works" onClick={scrollTo('how-it-works')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#testimonials" onClick={scrollTo('testimonials')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <CustomSelect
              value={currentCurrency}
              onChange={handleCurrencyChange}
              options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} ${c.symbol}` }))}
              className="w-[100px]"
              compact
            />
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
            >
              {isDark
                ? <MdLightMode className="text-xl text-amber-400" />
                : <MdDarkMode className="text-xl" />
              }
            </button>
            <Link to="/login" className="hidden sm:inline-flex text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2">Sign In</Link>
            <Link to="/register" className="bg-gradient-primary text-white text-xs sm:text-sm font-bold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:opacity-90 transition-all whitespace-nowrap">
              <span className="sm:hidden">Start Free</span>
              <span className="hidden sm:inline">Get Started Free</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-950 min-h-screen flex items-center pt-16">
        <div className="absolute inset-0" style={gridBg} />
        <div className="absolute -top-20 -left-20 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto w-full px-6 lg:px-10 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">Free forever · No credit card</span>
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-[1.05] tracking-tight mb-6">
              Take Back<br />
              Control of<br />
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-300 bg-clip-text text-transparent">
                Your Money
              </span>
            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-lg font-medium">
              Track income and expenses, set smart budgets, and see where every dollar goes — all in one powerful dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-gradient-primary text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-all shadow-2xl shadow-emerald-900/20 text-base group"
              >
                Start for Free <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center font-semibold px-8 py-4 rounded-2xl border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:border-emerald-500/40 dark:hover:text-white dark:hover:bg-white/5 transition-all text-base"
              >
                Sign In
              </Link>
            </div>

            <div className="flex flex-wrap gap-5">
              {['No credit card required', 'Free forever plan', 'Cancel anytime'].map((t) => (
                <span key={t} className="flex items-center gap-2 text-gray-500 dark:text-gray-500 text-sm font-medium">
                  <MdCheckCircle className="text-emerald-500 text-base flex-shrink-0" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Dashboard card */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-3xl scale-90" />
              <div className="relative bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl dark:shadow-none">
                {/* Header */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-white/8">
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">May 2025</p>
                    <p className="font-bold text-gray-800 dark:text-white mt-0.5 text-sm">Financial Overview</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5 rounded-full">
                    <MdTrendingUp className="text-emerald-600 dark:text-emerald-400 text-sm" />
                    <span className="text-emerald-700 dark:text-emerald-300 text-xs font-bold">+12.4%</span>
                  </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {[
                    { label: 'Total Balance',    value: '$12,450', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/15', color: 'text-emerald-700 dark:text-emerald-300' },
                    { label: 'Monthly Income',   value: '$5,200',  bg: 'bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/15',                 color: 'text-sky-700 dark:text-sky-300' },
                    { label: 'Monthly Expenses', value: '$3,180',  bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/15',             color: 'text-rose-700 dark:text-rose-300' },
                    { label: 'Net Savings',      value: '$2,020',  bg: 'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/15',     color: 'text-violet-700 dark:text-violet-300' },
                  ].map((c) => (
                    <div key={c.label} className={`${c.bg} border rounded-xl p-3.5`}>
                      <p className="text-[11px] text-gray-500 font-medium mb-1">{c.label}</p>
                      <p className={`text-sm font-bold tabular-nums ${c.color}`}>{c.value}</p>
                    </div>
                  ))}
                </div>

                {/* Budget bars */}
                <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-4">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-3">Budget Progress</p>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Food & Dining', pct: 72, color: 'bg-orange-400' },
                      { label: 'Transport',     pct: 45, color: 'bg-sky-400' },
                      { label: 'Shopping',      pct: 88, color: 'bg-violet-400' },
                      { label: 'Entertainment', pct: 30, color: 'bg-pink-400' },
                    ].map((b) => (
                      <div key={b.label}>
                        <div className="flex justify-between text-[11px] font-semibold mb-1">
                          <span className="text-gray-500 dark:text-gray-400">{b.label}</span>
                          <span className="text-gray-400 dark:text-gray-500">{b.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-white/8 rounded-full">
                          <div className={`h-full rounded-full ${b.color} opacity-80`} style={{ width: `${b.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-600/10 to-transparent pointer-events-none" />
      </section>

      {/* ── Stats band — always green ── */}
      <section className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={gridBg} />
        <div className="relative max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold text-white mb-1 tracking-tight">{value}</p>
              <p className="text-emerald-100 text-sm font-semibold uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Everything You Need
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              Powerful Tools,{' '}
              <span className="text-emerald-600 dark:text-emerald-400">Simple Design</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto font-medium">
              Every feature is built around one goal — helping you make better decisions with your money.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-7 border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-300 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 group-hover:bg-emerald-500 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300">
                  <Icon className="text-emerald-600 dark:text-emerald-400 group-hover:text-white text-2xl transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 tracking-tight">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-100 dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0" style={gridBg} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-emerald-500/6 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              Up and Running in{' '}
              <span className="text-emerald-600 dark:text-emerald-400">Minutes</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-500 text-lg max-w-xl mx-auto font-medium">No learning curve. Just sign up and start tracking.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="absolute top-7 left-7 right-7 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent hidden lg:block" />
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="group relative">
                <div className="relative w-14 h-14 bg-white dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300 group-hover:scale-110 shadow-sm dark:shadow-none">
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors">{step}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 tracking-tight">{title}</h3>
                <p className="text-gray-500 dark:text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              What Users Say
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
              Loved by Thousands
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, avatar }) => (
              <div key={name} className="group bg-white dark:bg-gray-800 rounded-2xl p-7 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex mb-5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{name}</p>
                    <p className="text-gray-400 text-xs font-semibold">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — always green ── */}
      <section className="relative overflow-hidden py-28 px-6 bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-500">
        <div className="absolute inset-0 opacity-20" style={gridBg} />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-emerald-900/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-2xl">
            <GiBee className="text-white text-3xl" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Ready to Master Your Finances?
          </h2>
          <p className="text-emerald-100 text-lg mb-10 max-w-xl mx-auto font-medium">
            Join over 50,000 users who have taken control of their financial lives with BudgetBee.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-10 py-4 rounded-2xl hover:bg-emerald-50 transition-all shadow-2xl text-lg group"
          >
            Create Free Account
            <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-emerald-200/60 text-sm mt-5 font-medium">No credit card · Always free to start</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-100 dark:bg-gray-950 py-8 px-6 border-t border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-primary rounded-lg flex items-center justify-center">
              <GiBee className="text-white text-sm" />
            </div>
            <span className="font-bold text-gray-500 dark:text-white/60 text-sm">BudgetBee</span>
          </div>
          <p className="text-gray-400 dark:text-white/25 text-sm">© {new Date().getFullYear()} BudgetBee. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
