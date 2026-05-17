import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdBarChart, MdPieChart, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { fetchSummary } from '../redux/slices/transactionSlice';
import { formatCurrency, CATEGORY_COLORS, getMonthName } from '../utils/formatters';
import CustomSelect from '../components/common/CustomSelect';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import TrendLineChart from '../components/charts/TrendLineChart';

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { summary, categoryBreakdown, monthlyTrend } = useSelector((s) => s.transactions);
  const { user } = useSelector((s) => s.auth);
  const currency = user?.currency || 'NPR';

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  useEffect(() => {
    dispatch(fetchSummary({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  const savingsRate = summary?.totalIncome > 0
    ? Math.round(((summary.totalIncome - summary.totalExpense) / summary.totalIncome) * 100)
    : 0;

  const totalExpense = categoryBreakdown.reduce((s, i) => s + i.total, 0);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Period Selector */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Period:</span>
        <CustomSelect
          value={selectedMonth}
          onChange={(val) => setSelectedMonth(parseInt(val))}
          options={Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: getMonthName(i + 1) }))}
          className="w-36"
        />
        <CustomSelect
          value={selectedYear}
          onChange={(val) => setSelectedYear(parseInt(val))}
          options={[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => ({ value: y, label: String(y) }))}
          className="w-24"
        />
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Income', value: summary?.totalIncome || 0, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: MdTrendingUp },
          { label: 'Total Expenses', value: summary?.totalExpense || 0, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', icon: MdTrendingDown },
          { label: 'Net Balance', value: (summary?.totalIncome || 0) - (summary?.totalExpense || 0), color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20', icon: MdBarChart },
          { label: 'Savings Rate', value: null, color: savingsRate >= 0 ? 'text-emerald-500' : 'text-red-500', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: MdPieChart, custom: `${savingsRate}%` },
        ].map(({ label, value, color, bg, icon: Icon, custom }) => (
          <div key={label} className="card p-4">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`text-xl ${color}`} />
            </div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">{label}</p>
            <p className={`text-xl font-extrabold ${color}`}>
              {custom || formatCurrency(value, currency)}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-serif font-bold text-gray-800 dark:text-gray-100 mb-1">Expense Breakdown</h3>
          <p className="text-xs text-gray-400 mb-4">By category for {getMonthName(selectedMonth)} {selectedYear}</p>
          <ExpensePieChart data={categoryBreakdown} currency={currency} />
        </div>

        <div className="card p-5">
          <h3 className="font-serif font-bold text-gray-800 dark:text-gray-100 mb-1">Monthly Comparison</h3>
          <p className="text-xs text-gray-400 mb-4">Income vs Expenses — {selectedYear}</p>
          <MonthlyBarChart data={monthlyTrend} currency={currency} />
        </div>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-serif font-bold text-gray-800 dark:text-gray-100 mb-1">Income Trend</h3>
          <p className="text-xs text-gray-400 mb-3">Monthly income over the year</p>
          <TrendLineChart data={monthlyTrend} type="income" currency={currency} />
        </div>
        <div className="card p-5">
          <h3 className="font-serif font-bold text-gray-800 dark:text-gray-100 mb-1">Expense Trend</h3>
          <p className="text-xs text-gray-400 mb-3">Monthly expenses over the year</p>
          <TrendLineChart data={monthlyTrend} type="expense" currency={currency} />
        </div>
      </div>

      {/* Category Table */}
      {categoryBreakdown.length > 0 && (
        <div className="card p-5">
          <h3 className="font-serif font-bold text-gray-800 dark:text-gray-100 mb-4">Category Details</h3>
          <div className="space-y-3">
            {categoryBreakdown.map((item) => {
              const pct = totalExpense > 0 ? Math.round((item.total / totalExpense) * 100) : 0;
              return (
                <div key={item._id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[item._id] }} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item._id}</span>
                      <span className="text-xs text-gray-400">({item.count} txns)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{pct}%</span>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{formatCurrency(item.total, currency)}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[item._id] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
