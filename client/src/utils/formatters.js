export const formatCurrency = (amount, currency = 'NPR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const formatDateInput = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const formatRelativeDate = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(date);
};

export const getMonthName = (month) => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[month - 1] || '';
};

export const CATEGORY_COLORS = {
  Food: '#f97316',
  Transportation: '#3b82f6',
  Shopping: '#8b5cf6',
  Bills: '#ef4444',
  Entertainment: '#ec4899',
  Health: '#10b981',
  Education: '#06b6d4',
  Travel: '#f59e0b',
  Saving: '#0d9488',
  SIP: '#6366f1',
  Cooperative: '#d97706',
  Salary: '#22c55e',
  Freelance: '#0ea5e9',
  Investment: '#14b8a6',
  Gift: '#e879f9',
  Others: '#94a3b8',
};

export const getCategoryColor = (categories, name) => {
  const found = categories?.find((c) => c.name === name);
  return found?.color || CATEGORY_COLORS[name] || '#94a3b8';
};

export const PAYMENT_METHODS = ['Bank Transfer', 'Cash', 'Credit Card', 'Debit Card', 'UPI', 'Others'];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'NPR', symbol: '₨', name: 'Nepalese Rupee' },
];
