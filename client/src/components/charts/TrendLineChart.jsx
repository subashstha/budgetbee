import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { getMonthName } from '../../utils/formatters';

const TrendLineChart = ({ data = [], type = 'expense', currency = 'USD' }) => {
  const monthMap = {};
  data.forEach(({ _id, total }) => {
    if (_id.type === type) {
      monthMap[_id.month] = { month: getMonthName(_id.month), amount: total };
    }
  });
  const chartData = Array.from({ length: 12 }, (_, i) => monthMap[i + 1] || { month: getMonthName(i + 1), amount: 0 });

  const color = type === 'income' ? '#10b981' : '#ef4444';
  const fmt = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: 'compact' }).format(v);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmt} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v) => [fmt(v), type.charAt(0).toUpperCase() + type.slice(1)]}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }}
        />
        <Area type="monotone" dataKey="amount" stroke={color} strokeWidth={2.5} fill={`url(#gradient-${type})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TrendLineChart;
