import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdEdit, MdSave, MdWarning, MdCheckCircle, MdAdd } from 'react-icons/md';
import toast from 'react-hot-toast';
import { fetchBudget, saveBudget, fetchBudgetHistory } from '../redux/slices/budgetSlice';
import { getMonthName, getCategoryColor } from '../utils/formatters';
import useCurrency from '../hooks/useCurrency';
import CustomSelect from '../components/common/CustomSelect';

const BudgetPage = () => {
  const dispatch = useDispatch();
  const { current: budget, totalSpent, history, loading } = useSelector((s) => s.budget);
  const allCategories = useSelector((s) => s.categories.list);
  const expenseCats = allCategories.filter((c) => c.type === 'expense' || c.type === 'both').map((c) => c.name);
  const { currency, format } = useCurrency();

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [editing, setEditing] = useState(false);
  const [totalBudget, setTotalBudget] = useState('');
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [alertThreshold, setAlertThreshold] = useState(80);

  useEffect(() => {
    dispatch(fetchBudget({ month, year }));
    dispatch(fetchBudgetHistory());
  }, [dispatch, month, year]);

  useEffect(() => {
    if (budget) {
      setTotalBudget(budget.totalBudget);
      setCategoryBudgets(budget.categoryBudgets || []);
      setAlertThreshold(budget.alertThreshold || 80);
    } else {
      setTotalBudget('');
      setCategoryBudgets([]);
      setAlertThreshold(80);
    }
  }, [budget]);

  const handleSave = async () => {
    if (!totalBudget || parseFloat(totalBudget) <= 0) return toast.error('Please enter a valid budget');
    try {
      await dispatch(saveBudget({
        month, year,
        totalBudget: parseFloat(totalBudget),
        categoryBudgets: categoryBudgets.filter((cb) => cb.limit > 0),
        alertThreshold,
      })).unwrap();
      toast.success('Budget saved!');
      setEditing(false);
      dispatch(fetchBudget({ month, year }));
    } catch (err) {
      toast.error(err || 'Failed to save budget');
    }
  };

  const handleCategoryLimit = (category, value) => {
    setCategoryBudgets((prev) => {
      const existing = prev.find((cb) => cb.category === category);
      if (existing) {
        return prev.map((cb) => cb.category === category ? { ...cb, limit: parseFloat(value) || 0 } : cb);
      }
      return [...prev, { category, limit: parseFloat(value) || 0 }];
    });
  };

  const getCatLimit = (cat) => categoryBudgets.find((cb) => cb.category === cat)?.limit || '';

  const budgetPercent = budget ? Math.min(Math.round((totalSpent / budget.totalBudget) * 100), 100) : 0;
  const budgetExceeded = budget && totalSpent > budget.totalBudget;
  const budgetAlert = budget && budgetPercent >= (budget.alertThreshold || 80) && !budgetExceeded;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Period Selector */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Budget for:</span>
        <CustomSelect
          value={month}
          onChange={(val) => setMonth(parseInt(val))}
          options={Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: getMonthName(i + 1) }))}
          className="w-36"
        />
        <CustomSelect
          value={year}
          onChange={(val) => setYear(parseInt(val))}
          options={[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => ({ value: y, label: String(y) }))}
          className="w-24"
        />
        <button onClick={() => setEditing(!editing)} className={editing ? 'btn-secondary text-sm' : 'btn-primary text-sm flex items-center gap-2'}>
          {editing ? 'Cancel' : <><MdEdit /> {budget ? 'Edit Budget' : 'Set Budget'}</>}
        </button>
      </div>

      {/* Alert Banner */}
      {budgetAlert && (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/30 rounded-2xl">
          <MdWarning className="text-yellow-500 text-2xl flex-shrink-0" />
          <p className="text-yellow-700 dark:text-yellow-400 text-sm font-medium">
            You've used {budgetPercent}% of your budget. Approaching your alert threshold!
          </p>
        </div>
      )}
      {budgetExceeded && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-2xl">
          <MdWarning className="text-red-500 text-2xl flex-shrink-0" />
          <p className="text-red-700 dark:text-red-400 text-sm font-medium">
            Budget exceeded! You've spent {format(totalSpent - (budget?.totalBudget || 0))} over your budget.
          </p>
        </div>
      )}

      {/* Main Budget Card */}
      <div className="card p-6">
        {editing ? (
          <div className="space-y-5">
            <h3 className="font-serif font-bold text-gray-800 dark:text-gray-100 text-lg">Configure Budget</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Total Monthly Budget ({currency})</label>
                <input
                  type="number"
                  placeholder="e.g. 3000"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  className="input-field"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Alert Threshold ({alertThreshold}%)</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
                  className="w-full accent-primary-500 mt-3"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category Budgets (Optional)</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {expenseCats.map((cat) => (
                  <div key={cat}>
                    <label className="block text-xs text-gray-500 mb-1">{cat}</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={getCatLimit(cat)}
                      onChange={(e) => handleCategoryLimit(cat, e.target.value)}
                      className="input-field text-sm"
                      min="0"
                      step="0.01"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleSave} className="btn-primary flex items-center gap-2">
              <MdSave /> Save Budget
            </button>
          </div>
        ) : budget ? (
          <div>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-serif font-bold text-gray-800 dark:text-gray-100 text-lg">{getMonthName(month)} {year} Budget</h3>
                <p className="text-gray-400 text-sm">Alert at {budget.alertThreshold}%</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{format(budget.totalBudget)}</p>
                <p className="text-sm text-gray-400">Total budget</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Spent: <strong className="text-gray-700 dark:text-gray-200">{format(totalSpent)}</strong></span>
                <span className="text-gray-500 dark:text-gray-400">Remaining: <strong className={budgetExceeded ? 'text-red-500' : 'text-emerald-500'}>{format(Math.max(budget.totalBudget - totalSpent, 0))}</strong></span>
              </div>
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${budgetExceeded ? 'bg-red-500' : budgetPercent >= alertThreshold ? 'bg-yellow-500' : 'bg-gradient-primary'}`}
                  style={{ width: `${budgetPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>0</span>
                <span className="font-semibold">{budgetPercent}% used</span>
                <span>{format(budget.totalBudget)}</span>
              </div>
            </div>

            {/* Category breakdown */}
            {budget.categoryBudgets?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category Budgets</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {budget.categoryBudgets.map((cb) => {
                    const spent = budget.categorySpent?.find((cs) => cs._id === cb.category)?.spent || 0;
                    const pct = cb.limit > 0 ? Math.min(Math.round((spent / cb.limit) * 100), 100) : 0;
                    const exceeded = spent > cb.limit;
                    return (
                      <div key={cb.category} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                        <div className="flex justify-between text-sm mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getCategoryColor(allCategories, cb.category) }} />
                            <span className="font-medium text-gray-700 dark:text-gray-300">{cb.category}</span>
                          </div>
                          {exceeded
                            ? <MdWarning className="text-red-500" />
                            : pct >= 80 ? <MdWarning className="text-yellow-500" />
                            : <MdCheckCircle className="text-emerald-500" />
                          }
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full mb-1">
                          <div className={`h-full rounded-full ${exceeded ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-gradient-primary'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-xs text-gray-400">{format(spent)} of {format(cb.limit)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="font-serif font-bold text-gray-700 dark:text-gray-300 text-lg mb-2">No Budget Set</h3>
            <p className="text-gray-400 text-sm mb-5">Set a monthly budget to track your spending and get alerts.</p>
            <button onClick={() => setEditing(true)} className="btn-primary flex items-center gap-2 mx-auto">
              <MdAdd /> Set Budget
            </button>
          </div>
        )}
      </div>

      {/* Budget History */}
      {history.length > 1 && (
        <div className="card p-5">
          <h3 className="font-serif font-bold text-gray-800 dark:text-gray-100 mb-4">Budget History</h3>
          <div className="space-y-3">
            {history.slice(0, 6).map((b) => (
              <div key={b._id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <div className="min-w-[80px]">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{getMonthName(b.month)} {b.year}</p>
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                    <div className="h-full bg-gradient-primary rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{format(b.totalBudget)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
