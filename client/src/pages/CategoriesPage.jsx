import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdAdd, MdClose, MdCategory } from 'react-icons/md';
import toast from 'react-hot-toast';
import { createCategory, deleteCategory } from '../redux/slices/categorySlice';

const PRESET_COLORS = [
  '#f97316','#3b82f6','#8b5cf6','#ef4444','#ec4899',
  '#10b981','#06b6d4','#f59e0b','#0d9488','#6366f1',
  '#d97706','#22c55e','#0ea5e9','#14b8a6','#e879f9','#94a3b8',
];

const TYPE_TABS = ['all', 'expense', 'income', 'both'];

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { list: categories, loading } = useSelector((s) => s.categories);

  const [activeTab, setActiveTab] = useState('all');
  const [addingCat, setAddingCat] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', type: 'expense', color: '#10b981' });

  const filtered = activeTab === 'all' ? categories : categories.filter((c) => c.type === activeTab);

  const handleAdd = async () => {
    if (!newCat.name.trim()) return toast.error('Category name is required');
    setSaving(true);
    try {
      await dispatch(createCategory(newCat)).unwrap();
      toast.success('Category added!');
      setNewCat({ name: '', type: 'expense', color: '#10b981' });
      setAddingCat(false);
    } catch (err) {
      toast.error(err || 'Failed to add category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      toast.success('Category deleted');
    } catch (err) {
      toast.error(err || 'Cannot delete a default category');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-gray-900 dark:text-white text-xl">Categories</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage expense and income categories</p>
        </div>
        {!addingCat && (
          <button onClick={() => setAddingCat(true)} className="btn-primary flex items-center gap-2 text-sm">
            <MdAdd className="text-lg" /> Add Category
          </button>
        )}
      </div>

      {/* Add form */}
      {addingCat && (
        <div className="card p-5 space-y-4 border-2 border-primary-200 dark:border-primary-800/40">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">New Category</h3>
            <button onClick={() => setAddingCat(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <MdClose />
            </button>
          </div>

          <input
            type="text"
            placeholder="Category name"
            value={newCat.name}
            onChange={(e) => setNewCat((p) => ({ ...p, name: e.target.value }))}
            className="input-field"
            maxLength={50}
            autoFocus
          />

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Type</p>
            <div className="flex gap-2">
              {['expense', 'income', 'both'].map((t) => (
                <button
                  key={t}
                  onClick={() => setNewCat((p) => ({ ...p, type: t }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize border-2 transition-colors ${
                    newCat.type === t
                      ? t === 'expense'
                        ? 'bg-red-500 text-white border-red-500'
                        : t === 'income'
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-primary-500 text-white border-primary-500'
                      : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Color</p>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewCat((p) => ({ ...p, color }))}
                  className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${newCat.color === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 flex-1">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: newCat.color }} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{newCat.name || 'Preview'}</span>
              <span className="text-xs text-gray-400 capitalize ml-auto">({newCat.type})</span>
            </div>
            <button onClick={handleAdd} disabled={saving} className="btn-primary text-sm px-5">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Tab filter */}
      <div className="card p-1 flex gap-1">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
              activeTab === tab
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Category grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <MdCategory className="text-5xl text-gray-200 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No categories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((cat) => (
            <div
              key={cat._id}
              className="card p-4 flex items-center gap-3 group relative hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-base shadow-sm" style={{ backgroundColor: cat.color }}>
                {cat.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{cat.name}</p>
                <p className="text-xs text-gray-400 capitalize">{cat.type}</p>
              </div>
              {!cat.isDefault && (
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="absolute top-2 right-2 p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MdClose className="text-sm" />
                </button>
              )}
              {cat.isDefault && (
                <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wide text-gray-300 dark:text-gray-600">default</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
