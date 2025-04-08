
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Housing",
    budget: 1400,
    spent: 1200,
  },
  {
    name: "Food",
    budget: 600,
    spent: 500,
  },
  {
    name: "Transport",
    budget: 400,
    spent: 300,
  },
  {
    name: "Utilities",
    budget: 200,
    spent: 150,
  },
  {
    name: "Entertainment",
    budget: 300,
    spent: 200,
  },
];

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-aura-dark-gray border border-gray-700 rounded-md shadow-lg">
        <p className="font-medium text-aura-primary-text">{label}</p>
        <p className="text-aura-chart-blue">
          Budget: <span className="font-medium">${payload[0].value}</span>
        </p>
        <p className="text-aura-gold">
          Spent: <span className="font-medium">${payload[1].value}</span>
        </p>
        <p className="text-xs text-aura-secondary-text mt-1">
          {payload[1].value < payload[0].value
            ? `$${(payload[0].value - payload[1].value).toFixed(2)} remaining`
            : `$${(payload[1].value - payload[0].value).toFixed(2)} over budget`}
        </p>
      </div>
    );
  }
  return null;
};

const BudgetBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        barGap={0}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#333B48" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#B8C0D0' }} 
          axisLine={{ stroke: '#333B48' }}
        />
        <YAxis 
          tick={{ fill: '#B8C0D0' }} 
          axisLine={{ stroke: '#333B48' }} 
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          formatter={(value) => (
            <span style={{ color: value === 'budget' ? '#88B0F4' : '#D4AF37' }}>
              {value === 'budget' ? 'Budget' : 'Spent'}
            </span>
          )}
        />
        <Bar 
          dataKey="budget" 
          fill="#88B0F4" 
          radius={[4, 4, 0, 0]} 
          animationBegin={0}
          animationDuration={1500}
        />
        <Bar 
          dataKey="spent" 
          fill="#D4AF37" 
          radius={[4, 4, 0, 0]} 
          animationBegin={300}
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BudgetBarChart;
