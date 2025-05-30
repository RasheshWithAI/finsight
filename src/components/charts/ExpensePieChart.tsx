
import { useState } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip, 
  Sector 
} from "recharts";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
}

// Default data if no transactions provided
const defaultData = [
  { name: "Housing", value: 1200, color: "#88B0F4" }, // Light Blue
  { name: "Food", value: 500, color: "#8BC34A" },     // Muted Green 
  { name: "Transportation", value: 300, color: "#F48C06" }, // Vibrant Orange
  { name: "Entertainment", value: 200, color: "#D4AF37" }, // Rich Gold
  { name: "Utilities", value: 150, color: "#9575CD" }  // Purple
];

// Category colors mapping
const categoryColors: Record<string, string> = {
  "Housing": "#88B0F4",
  "Food & Dining": "#8BC34A",
  "Transportation": "#F48C06",
  "Entertainment": "#D4AF37",
  "Utilities": "#9575CD",
  "Education": "#FF5722",
  "Gym memberships": "#009688",
  "Debt": "#E91E63",
  "Maintenance and repairs": "#3F51B5",
  "Others": "#607D8B"
};

// Custom active shape for animation
const renderActiveShape = (props: any) => {
  const { 
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value 
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10} // Expand size when active
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="filter drop-shadow-md"
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={innerRadius - 4}
        outerRadius={innerRadius - 1}
        fill={fill}
      />
      <text 
        x={cx} 
        y={cy - 10} 
        textAnchor="middle" 
        fill="#F5F7FA" 
        className="text-sm font-medium"
      >
        {payload.name}
      </text>
      <text 
        x={cx} 
        y={cy + 10} 
        textAnchor="middle" 
        fill="#D4AF37" 
        className="text-sm font-bold"
      >
        ${value} ({(percent * 100).toFixed(1)}%)
      </text>
    </g>
  );
};

// Custom tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-aura-dark-gray border border-gray-700 rounded-md shadow-lg">
        <p className="font-medium text-aura-primary-text">{payload[0].name}</p>
        <p className="text-aura-gold font-medium">${payload[0].value}</p>
        <p className="text-xs text-aura-secondary-text">
          {(payload[0].percent * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

interface ExpensePieChartProps {
  transactions?: Transaction[];
}

const ExpensePieChart = ({ transactions }: ExpensePieChartProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Process transactions data if provided
  const processTransactionData = () => {
    if (!transactions || transactions.length === 0) {
      return defaultData;
    }

    // Only include expense transactions
    const expenseTransactions = transactions.filter(t => t.type === "expense");
    
    if (expenseTransactions.length === 0) {
      return defaultData;
    }

    // Group by category and sum amounts
    const categoryMap = new Map<string, number>();
    
    expenseTransactions.forEach(transaction => {
      const currentAmount = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, currentAmount + transaction.amount);
    });

    // Convert to chart data format
    return Array.from(categoryMap.entries()).map(([category, value]) => ({
      name: category,
      value,
      color: categoryColors[category] || "#607D8B" // Default to gray if no color defined
    }));
  };

  const chartData = processTransactionData();

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
          onMouseEnter={onPieEnter}
          animationDuration={800}
          animationBegin={0}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center" 
          formatter={(value) => <span className="text-aura-primary-text">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpensePieChart;
