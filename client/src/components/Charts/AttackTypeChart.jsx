import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { attackTypeColors } from '../../utils/helpers';

const AttackTypeChart = ({ data, title = 'Attacks by Type' }) => {
  // Format data for chart
  const chartData = Object.entries(data).map(([type, count]) => ({
    name: type,
    count: count
  })).sort((a, b) => b.count - a.count);
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full">
      <h3 className="text-white text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
            <XAxis type="number" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#9CA3AF" 
              tick={{ fontSize: 10 }}
              width={120}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={attackTypeColors[entry.name] || '#6B7280'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttackTypeChart;
