import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { getMonthName } from '../../utils/formatters';

const MonthlyBarChart = ({ data = [], currency = 'USD' }) => {
  const monthMap = {};
  data.forEach(({ _id, total }) => {
    const key = _id.month;
    if (!monthMap[key]) monthMap[key] = { month: getMonthName(key), income: 0, expense: 0 };
    if (_id.type === 'income') monthMap[key].income = total;
    if (_id.type === 'expense') monthMap[key].expense = total;
  });
  const chartData = Object.values(monthMap).sort((a, b) => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

  const fmt = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: 'compact' }).format(v);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 border border-gray-100 dark:border-gray-700 text-sm">
          <p className="font-bold text-gray-700 dark:text-gray-200 mb-2">{label}</p>
          {payload.map((p) => (
            <p key={p.dataKey} style={{ color: p.fill }} className="font-medium">
              {p.dataKey.charAt(0).toUpperCase() + p.dataKey.slice(1)}: {fmt(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        <div className="text-center"><div className="text-4xl mb-2">📈</div><p className="text-sm">No data for this year</p></div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(v) => <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{v}</span>} />
        <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="income" maxBarSize={40} />
        <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="expense" maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyBarChart;
