import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CATEGORY_COLORS } from '../../utils/formatters';

const ExpensePieChart = ({ data = [], currency = 'USD' }) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm">No expense data</p>
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item._id,
    value: item.total,
    color: CATEGORY_COLORS[item._id] || '#94a3b8',
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0];
      const total = chartData.reduce((s, i) => s + i.value, 0);
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 border border-gray-100 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{d.name}</p>
          <p className="text-primary-500 font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(d.value)}</p>
          <p className="text-xs text-gray-400">{((d.value / total) * 100).toFixed(1)}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={3} dataKey="value">
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpensePieChart;
