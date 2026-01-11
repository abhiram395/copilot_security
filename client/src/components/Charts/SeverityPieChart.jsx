import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { severityColors } from '../../utils/helpers';

const SeverityPieChart = ({ data, title = 'Severity Distribution' }) => {
  // Format data for chart
  const chartData = Object.entries(data).map(([severity, count]) => ({
    name: severity,
    value: count
  })).filter(item => item.value > 0);
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full">
      <h3 className="text-white text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: '#9CA3AF' }}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={severityColors[entry.name] || '#6B7280'}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value, name) => [value, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SeverityPieChart;
