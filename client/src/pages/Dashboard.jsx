import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  MdTrendingUp, MdTrendingDown, MdAccountBalance,
  MdSavings, MdAdd, MdArrowForward,
} from 'react-icons/md';
import { fetchSummary } from '../redux/slices/transactionSlice';
import { fetchBudget } from '../redux/slices/budgetSlice';
import { openModal, setEditingTransaction } from '../redux/slices/uiSlice';
import { formatRelativeDate, CATEGORY_COLORS } from '../utils/formatters';
import useCurrency from '../hooks/useCurrency';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';

const StatCard = ({ icon: Icon, title, value, iconBg, iconColor, valueColor, accent }) => (
  <div className={`card card-hover p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 ${accent ? 'ring-1 ring-emerald-200 dark:ring-emerald-800/50' : ''}`}>
    <div className="flex items-center justify-between">
      <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon className={`text-lg sm:text-xl ${iconColor}`} />
      </div>
      {accent && (
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      )}
    </div>
    <div className="min-w-0">
      <p className="stat-label mb-1 sm:mb-1.5 text-[10px] sm:text-xs">{title}</p>
      <p className={`text-base sm:text-xl font-bold tabular-nums tracking-tight truncate ${valueColor}`}>
        {value}
      </p>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { summary, categoryBreakdown, monthlyTrend, recentTransactions } = useSelector((s) => s.transactions);
  const { current: budget, totalSpent } = useSelector((s) => s.budget);
  const { user } = useSelector((s) => s.auth);
  const { currency, format } = useCurrency();

  useEffect(() => {
    dispatch(fetchSummary({}));
    dispatch(fetchBudget({}));
  }, [dispatch]);

  const balance      = (summary?.totalIncome || 0) - (summary?.totalExpense || 0);
  const budgetPct    = budget ? Math.min(Math.round((totalSpent / budget.totalBudget) * 100), 100) : 0;
  const budgetExceed = budget && totalSpent > budget.totalBudget;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-slide-up">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 font-medium">
            Here's your financial snapshot for this month
          </p>
        </div>
        <button
          onClick={() => { dispatch(setEditingTransaction(null)); dispatch(openModal('transaction')); }}
          className="btn-primary hidden lg:flex items-center gap-2 flex-shrink-0"
        >
          <MdAdd className="text-lg" /> Quick Add
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={MdAccountBalance}
          title="Total Balance"
          value={format(balance)}
          iconBg={balance >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}
          iconColor={balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}
          valueColor={balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}
          accent={balance >= 0}
        />
        <StatCard
          icon={MdTrendingUp}
          title="Monthly Income"
          value={format(summary?.totalIncome || 0)}
          iconBg="bg-sky-50 dark:bg-sky-900/20"
          iconColor="text-sky-500 dark:text-sky-400"
          valueColor="text-gray-900 dark:text-white"
        />
        <StatCard
          icon={MdTrendingDown}
          title="Monthly Expenses"
          value={format(summary?.totalExpense || 0)}
          iconBg="bg-rose-50 dark:bg-rose-900/20"
          iconColor="text-rose-500 dark:text-rose-400"
          valueColor="text-gray-900 dark:text-white"
        />
        <StatCard
          icon={MdSavings}
          title="Net Savings"
          value={format(Math.max(balance, 0))}
          iconBg="bg-violet-50 dark:bg-violet-900/20"
          iconColor="text-violet-500 dark:text-violet-400"
          valueColor="text-gray-900 dark:text-white"
        />
      </div>

      {/* ── Middle Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Budget */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-gray-900 dark:text-white">Monthly Budget</h3>
            <Link to="/budget" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:gap-2 transition-all">
              Manage <MdArrowForward />
            </Link>
          </div>

          {budget ? (
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Spent</span>
                <span className={`text-base font-bold tabular-nums ${budgetExceed ? 'text-red-500' : 'text-gray-800 dark:text-gray-100'}`}>
                  {format(totalSpent)}
                  <span className="text-xs text-gray-400 font-normal ml-1">/ {format(budget.totalBudget)}</span>
                </span>
              </div>

              <div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      budgetExceed ? 'bg-red-500' : budgetPct > 80 ? 'bg-amber-400' : 'bg-gradient-primary'
                    }`}
                    style={{ width: `${budgetPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                  <span className={budgetExceed ? 'text-red-500 font-semibold' : ''}>
                    {budgetExceed ? '⚠ Over budget' : `${budgetPct}% used`}
                  </span>
                  <span className={budgetExceed ? 'text-red-500 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
                    {budgetExceed
                      ? `+${format(totalSpent - budget.totalBudget)}`
                      : `${format(budget.totalBudget - totalSpent)} left`
                    }
                  </span>
                </div>
              </div>

              {categoryBreakdown.length > 0 && (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2.5">
                  <p className="stat-label mb-3">Top Categories</p>
                  {categoryBreakdown.slice(0, 4).map((item) => (
                    <div key={item._id} className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[item._id] }} />
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex-1 truncate font-medium">{item._id}</span>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-200 tabular-nums">{format(item.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <MdAccountBalance className="text-emerald-500 text-xl" />
              </div>
              <p className="text-sm text-gray-400 font-medium mb-4">No budget set for this month</p>
              <Link to="/budget" className="btn-primary text-sm px-5 py-2 inline-block">Set Budget</Link>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-display font-bold text-gray-900 dark:text-white">Expenses</h3>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">By category this month</p>
            </div>
            <Link to="/analytics" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:gap-2 transition-all">
              Details <MdArrowForward />
            </Link>
          </div>
          <ExpensePieChart data={categoryBreakdown} currency={currency} />
        </div>

        {/* Bar Chart */}
        <div className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-display font-bold text-gray-900 dark:text-white">Overview</h3>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">Income vs Expenses</p>
            </div>
            <Link to="/analytics" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:gap-2 transition-all">
              Report <MdArrowForward />
            </Link>
          </div>
          <MonthlyBarChart data={monthlyTrend} currency={currency} />
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg">Recent Transactions</h3>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">Your latest activity</p>
          </div>
          <Link to="/transactions" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:gap-2 transition-all">
            View All <MdArrowForward />
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-gray-50 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MdAdd className="text-2xl text-gray-300" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">No transactions yet</p>
            <p className="text-gray-400 text-sm mb-5">Start tracking by adding your first transaction</p>
            <button
              onClick={() => { dispatch(setEditingTransaction(null)); dispatch(openModal('transaction')); }}
              className="btn-primary text-sm px-6"
            >
              <MdAdd className="inline mr-1" /> Add Transaction
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {recentTransactions.map((t) => (
              <div key={t._id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 group">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[t.category] || '#10b981' }}
                >
                  {t.category.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{t.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">{t.category} · {formatRelativeDate(t.date)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-bold text-sm tabular-nums ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '−'}{format(t.amount)}
                  </p>
                  <p className="text-xs text-gray-300 dark:text-gray-600 capitalize mt-0.5 font-medium">{t.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
