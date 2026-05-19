import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import { createTransaction, updateTransaction, fetchSummary, fetchTransactions } from '../redux/slices/transactionSlice';
import { closeModal } from '../redux/slices/uiSlice';
import { PAYMENT_METHODS, formatDateInput } from '../utils/formatters';
import CustomSelect from './common/CustomSelect';
import DatePicker from './common/DatePicker';

const TransactionModal = () => {
  const dispatch = useDispatch();
  const { editingTransaction } = useSelector((state) => state.ui);
  const allCategories = useSelector((state) => state.categories.list);
  const isEditing = !!editingTransaction;

  const getCategoriesForType = (type) =>
    allCategories
      .filter((c) => c.type === type || c.type === 'both')
      .map((c) => c.name);

  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    paymentMethod: 'Bank Transfer',
    date: formatDateInput(new Date()),
    notes: '',
    isRecurring: false,
    recurringFrequency: null,
  });

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        title: editingTransaction.title || '',
        amount: editingTransaction.amount || '',
        type: editingTransaction.type || 'expense',
        category: editingTransaction.category || '',
        paymentMethod: editingTransaction.paymentMethod || 'Bank Transfer',
        date: formatDateInput(editingTransaction.date || new Date()),
        notes: editingTransaction.notes || '',
        isRecurring: editingTransaction.isRecurring || false,
        recurringFrequency: editingTransaction.recurringFrequency || null,
      });
    }
  }, [editingTransaction]);

  const categories = getCategoriesForType(form.type);

  useEffect(() => {
    if (!form.category && categories.length > 0) {
      setForm((f) => ({ ...f, category: categories[0] }));
    }
  }, [categories]);

  const handleTypeChange = (type) => {
    const newCategories = getCategoriesForType(type);
    setForm((f) => ({
      ...f,
      type,
      category: newCategories[0] || '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount || parseFloat(form.amount) <= 0) {
      return toast.error('Please fill in all required fields');
    }

    try {
      if (isEditing) {
        await dispatch(updateTransaction({ id: editingTransaction._id, data: form })).unwrap();
        toast.success('Transaction updated!');
      } else {
        await dispatch(createTransaction({ ...form, amount: parseFloat(form.amount) })).unwrap();
        toast.success('Transaction added!');
      }
      dispatch(fetchSummary({}));
      dispatch(closeModal());
    } catch (err) {
      toast.error(err || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-gray-900 dark:text-white text-lg">
              {isEditing ? 'Edit Transaction' : 'New Transaction'}
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Track your {form.type}</p>
          </div>
          <button
            onClick={() => dispatch(closeModal())}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition-colors"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Type Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all capitalize ${
                  form.type === t
                    ? t === 'expense'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-emerald-500 text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Title *</label>
              <input
                type="text"
                placeholder="e.g. Coffee, Salary..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Amount *</label>
              <input
                type="number"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Date *</label>
              <DatePicker
                value={form.date}
                onChange={(val) => setForm({ ...form, date: val })}
                placeholder="Select date"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Category *</label>
              <CustomSelect value={form.category} onChange={(val) => setForm({ ...form, category: val })} options={categories} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Payment Method</label>
              <CustomSelect value={form.paymentMethod} onChange={(val) => setForm({ ...form, paymentMethod: val })} options={PAYMENT_METHODS} />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Notes</label>
              <textarea
                placeholder="Add a note..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-field resize-none"
                rows={2}
              />
            </div>

            <div className="col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="recurring"
                checked={form.isRecurring}
                onChange={(e) => setForm({ ...form, isRecurring: e.target.checked, recurringFrequency: e.target.checked ? 'monthly' : null })}
                className="w-4 h-4 text-primary-500 rounded"
              />
              <label htmlFor="recurring" className="text-sm font-medium text-gray-700 dark:text-gray-300">Recurring transaction</label>
              {form.isRecurring && (
                <CustomSelect
                  value={form.recurringFrequency || 'monthly'}
                  onChange={(val) => setForm({ ...form, recurringFrequency: val })}
                  options={['daily', 'weekly', 'monthly', 'yearly']}
                  className="ml-auto w-36"
                />
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => dispatch(closeModal())} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{isEditing ? 'Update' : 'Add'} Transaction</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
