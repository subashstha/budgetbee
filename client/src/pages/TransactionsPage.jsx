import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MdSearch, MdFilterList, MdEdit, MdDelete, MdAdd,
  MdDownload, MdClose, MdRepeat, MdTableChart, MdPictureAsPdf,
  MdImage, MdGridOn,
} from 'react-icons/md';
import toast from 'react-hot-toast';
import { fetchTransactions, deleteTransaction, setFilters, clearFilters } from '../redux/slices/transactionSlice';
import { openModal, setEditingTransaction } from '../redux/slices/uiSlice';
import { getCategoryColor } from '../utils/formatters';
import useDate from '../hooks/useDate';
import useCurrency from '../hooks/useCurrency';
import CustomSelect from '../components/common/CustomSelect';
import DatePicker from '../components/common/DatePicker';
import { exportToCSV, exportToExcel, exportToPDF, exportToPNG } from '../utils/exportUtils';

const PAYMENT_BADGE = {
  Cash: 'bg-green-100 text-green-700',
  'Credit Card': 'bg-purple-100 text-purple-700',
  'Debit Card': 'bg-blue-100 text-blue-700',
  'Bank Transfer': 'bg-orange-100 text-orange-700',
  UPI: 'bg-teal-100 text-teal-700',
};

const TransactionsPage = () => {
  const dispatch = useDispatch();
  const { list, total, pages, currentPage, loading, filters } = useSelector((s) => s.transactions);
  const categoryList = useSelector((s) => s.categories.list);
  const { format: formatDate } = useDate();
  const { currency, format: formatAmount } = useCurrency();
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState(null);
  const tableRef = useRef(null);
  const exportMenuRef = useRef(null);

  const allCategories = [...new Set(categoryList.map((c) => c.name))];

  useEffect(() => {
    dispatch(fetchTransactions({ ...filters, page: currentPage }));
  }, [dispatch, filters]);

  const handleSearch = (e) => dispatch(setFilters({ search: e.target.value }));

  const handleFilter = (key, value) => dispatch(setFilters({ [key]: value }));

  const handleSort = (sortBy) => {
    const sortOrder = filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    dispatch(setFilters({ sortBy, sortOrder }));
  };

  const handleEdit = (transaction) => {
    dispatch(setEditingTransaction(transaction));
    dispatch(openModal('transaction'));
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTransaction(id)).unwrap();
      toast.success('Transaction deleted');
      setDeleteConfirm(null);
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleExport = async (format) => {
    setShowExportMenu(false);
    setExporting(format);
    try {
      if (format === 'csv')   await exportToCSV();
      if (format === 'excel') await exportToExcel(currency);
      if (format === 'pdf')   await exportToPDF(currency);
      if (format === 'png')   await exportToPNG(tableRef.current);
      toast.success(`Exported as ${format.toUpperCase()}!`);
    } catch (e) {
      console.error('Export error:', e);
      toast.error(`Export failed: ${e.message || e}`);
    } finally {
      setExporting(null);
    }
  };

  const handlePage = (p) => dispatch(fetchTransactions({ ...filters, page: p }));

  const hasFilters = filters.type || filters.category || filters.startDate || filters.endDate || filters.search;

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{total} transaction{total !== 1 ? 's' : ''} found</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setShowExportMenu((v) => !v)}
              disabled={!!exporting}
              className="btn-secondary flex items-center gap-2 text-sm px-4 py-2 disabled:opacity-60"
            >
              {exporting ? (
                <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <MdDownload />
              )}
              Export
            </button>

            {showExportMenu && (
              <div
                className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-1.5 z-50"
                onMouseLeave={() => setShowExportMenu(false)}
              >
                {[
                  { fmt: 'csv',   icon: MdTableChart,    label: 'CSV',   desc: 'Spreadsheet text' },
                  { fmt: 'excel', icon: MdGridOn,         label: 'Excel', desc: '.xlsx workbook' },
                  { fmt: 'pdf',   icon: MdPictureAsPdf,   label: 'PDF',   desc: 'Formatted report' },
                  { fmt: 'png',   icon: MdImage,          label: 'PNG',   desc: 'Image snapshot' },
                ].map(({ fmt, icon: Icon, label, desc }) => (
                  <button
                    key={fmt}
                    onClick={() => handleExport(fmt)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                  >
                    <Icon className="text-emerald-500 text-lg flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-none">{label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => { dispatch(setEditingTransaction(null)); dispatch(openModal('transaction')); }} className="btn-primary flex items-center gap-2 text-sm">
            <MdAdd /> Add New
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card p-4 space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={handleSearch}
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 px-4 ${showFilters ? 'ring-2 ring-primary-400' : ''}`}
          >
            <MdFilterList /> Filters
            {hasFilters && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
          </button>
          {hasFilters && (
            <button onClick={() => dispatch(clearFilters())} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
              <MdClose /> Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1 border-t border-gray-100 dark:border-gray-700">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Type</label>
              <CustomSelect
                value={filters.type}
                onChange={(val) => handleFilter('type', val)}
                options={[{ value: '', label: 'All Types' }, { value: 'income', label: 'Income' }, { value: 'expense', label: 'Expense' }]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Category</label>
              <CustomSelect
                value={filters.category}
                onChange={(val) => handleFilter('category', val)}
                options={[{ value: '', label: 'All Categories' }, ...allCategories.map((c) => ({ value: c, label: c }))]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">From Date</label>
              <DatePicker value={filters.startDate} onChange={(val) => handleFilter('startDate', val)} placeholder="From date" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">To Date</label>
              <DatePicker value={filters.endDate} onChange={(val) => handleFilter('endDate', val)} placeholder="To date" />
            </div>
          </div>
        )}

        {/* Sort */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">Sort:</span>
          {[
            { key: 'date', label: 'Date' },
            { key: 'amount', label: 'Amount' },
            { key: 'title', label: 'Name' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${filters.sortBy === key ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              {label} {filters.sortBy === key && (filters.sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card overflow-hidden" ref={tableRef}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">💸</div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No transactions found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    {['Transaction', 'Category', 'Date', 'Payment', 'Amount', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {list.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: getCategoryColor(categoryList, t.category) }}>
                            {t.category.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{t.title}</p>
                            {t.notes && <p className="text-xs text-gray-400 truncate max-w-[180px]">{t.notes}</p>}
                            {t.isRecurring && (
                              <span className="inline-flex items-center gap-1 text-xs text-primary-500">
                                <MdRepeat className="text-xs" /> {t.recurringFrequency}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{t.category}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(t.date)}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${PAYMENT_BADGE[t.paymentMethod] || 'bg-gray-100 text-gray-600'}`}>{t.paymentMethod}</span>
                      </td>
                      <td className={`px-5 py-4 font-bold text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEdit(t)} className="p-2 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                            <MdEdit className="text-lg" />
                          </button>
                          <button onClick={() => setDeleteConfirm(t._id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <MdDelete className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700/50">
              {list.map((t) => (
                <div key={t._id} className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: getCategoryColor(categoryList, t.category) }}>
                    {t.category.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{t.title}</p>
                    <p className="text-xs text-gray-400">{t.category} • {formatDate(t.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                    </p>
                    <div className="flex gap-1 justify-end mt-1">
                      <button onClick={() => handleEdit(t)} className="p-1 text-gray-400 hover:text-primary-500"><MdEdit /></button>
                      <button onClick={() => setDeleteConfirm(t._id)} className="p-1 text-gray-400 hover:text-red-500"><MdDelete /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePage(p)}
              className={`w-9 h-9 rounded-xl font-semibold text-sm transition-colors ${p === currentPage ? 'bg-gradient-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="card p-6 max-w-sm w-full animate-slide-up text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Delete Transaction?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger flex-1">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
