
import { useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { Button } from "@/components/ui/button";

// Generate sample data
const generateMockData = (days: number, volatility: number = 0.02) => {
  const data = [];
  let price = 150;
  const baseDate = new Date(2024, 3, 7); // April 7, 2024
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() - i);
    
    // Random price movement with some trend
    const change = price * (Math.random() * volatility * 2 - volatility);
    price = Number((price + change).toFixed(2));
    
    data.push({
      date: date.toISOString().split('T')[0],
      price,
      volume: Math.floor(Math.random() * 1000000) + 500000,
    });
  }
  return data;
};

const oneYearData = generateMockData(365);
const sixMonthData = oneYearData.slice(oneYearData.length - 180);
const oneMonthData = oneYearData.slice(oneYearData.length - 30);
const oneWeekData = oneYearData.slice(oneYearData.length - 7);
const oneDayData = oneYearData.slice(oneYearData.length - 1);

interface StockLineChartProps {
  symbol?: string;
  showOverlay?: boolean;
  comparisonData?: any;
}

const StockLineChart = ({ symbol = "AAPL", showOverlay = false, comparisonData }: StockLineChartProps) => {
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "6M" | "1Y">("1M");
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  
  let chartData;
  switch (timeframe) {
    case "1D":
      chartData = oneDayData;
      break;
    case "1W":
      chartData = oneWeekData;
      break;
    case "1M":
      chartData = oneMonthData;
      break;
    case "6M":
      chartData = sixMonthData;
      break;
    case "1Y":
      chartData = oneYearData;
      break;
    default:
      chartData = oneMonthData;
  }

  const latestPrice = chartData[chartData.length - 1].price;
  const startPrice = chartData[0].price;
  const priceChange = latestPrice - startPrice;
  const priceChangePercent = (priceChange / startPrice) * 100;
  
  const isPositive = priceChange >= 0;
  const domain = chartData.reduce(
    (acc: [number, number], item: any) => [
      Math.min(acc[0], item.price * 0.99),
      Math.max(acc[1], item.price * 1.01),
    ],
    [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
  );

  const handleMouseMove = useCallback((props: any) => {
    if (props && props.activePayload) {
      setSelectedPoint(props.activePayload[0].payload);
    }
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setSelectedPoint(null);
  }, []);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-aura-dark-gray border border-gray-700 rounded-md shadow-lg">
          <p className="font-medium text-aura-primary-text">{label}</p>
          <p className="text-aura-gold text-lg font-bold">
            ${payload[0].value.toFixed(2)}
          </p>
          {payload.length > 1 && (
            <p className="text-aura-chart-blue text-lg font-bold">
              ${payload[1].value.toFixed(2)}
            </p>
          )}
          <p className="text-xs text-aura-secondary-text mt-1">
            Volume: {parseInt(payload[0].payload.volume).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="stock-chart">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <div className="flex items-baseline">
            <h3 className="text-2xl font-bold text-aura-primary-text mr-3">${latestPrice.toFixed(2)}</h3>
            <span className={`text-sm font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {isPositive ? "+" : ""}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
            </span>
          </div>
          <p className="text-sm text-aura-secondary-text">{timeframe} Chart • {symbol}</p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant={timeframe === "1D" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeframe("1D")}
          >
            1D
          </Button>
          <Button 
            variant={timeframe === "1W" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeframe("1W")}
          >
            1W
          </Button>
          <Button 
            variant={timeframe === "1M" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeframe("1M")}
          >
            1M
          </Button>
          <Button 
            variant={timeframe === "6M" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeframe("6M")}
          >
            6M
          </Button>
          <Button 
            variant={timeframe === "1Y" ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeframe("1Y")}
          >
            1Y
          </Button>
        </div>
      </div>

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <CartesianGrid stroke="#333B48" strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#B8C0D0' }} 
              axisLine={{ stroke: '#333B48' }}
              tickFormatter={(value) => {
                // Different formatting based on timeframe
                if (timeframe === "1D") {
                  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } else if (timeframe === "1W" || timeframe === "1M") {
                  return new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' });
                } else {
                  return new Date(value).toLocaleDateString([], { month: 'short', year: '2-digit' });
                }
              }}
            />
            <YAxis 
              domain={domain} 
              tick={{ fill: '#B8C0D0' }} 
              axisLine={{ stroke: '#333B48' }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference line for opening price */}
            <ReferenceLine
              y={startPrice}
              stroke="#888"
              strokeDasharray="3 3"
            />
            
            {/* Price line */}
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#8BC34A" : "#F44336"}
              strokeWidth={2}
              dot={false}
              activeDot={{ 
                r: 6, 
                stroke: '#D4AF37', 
                strokeWidth: 2, 
                fill: isPositive ? "#8BC34A" : "#F44336"
              }}
              animationDuration={1000}
            />
            
            {/* Comparison line if data is provided */}
            {showOverlay && comparisonData && (
              <Line
                type="monotone"
                data={comparisonData}
                dataKey="price"
                stroke="#88B0F4"
                strokeWidth={2}
                dot={false}
                activeDot={{ 
                  r: 6, 
                  stroke: '#D4AF37', 
                  strokeWidth: 2, 
                  fill: "#88B0F4"
                }}
              />
            )}
            
            {/* Highlight area for price change */}
            <ReferenceArea
              x1={chartData[0].date}
              x2={chartData[chartData.length - 1].date}
              y1={Math.min(startPrice, latestPrice)}
              y2={Math.max(startPrice, latestPrice)}
              fill={isPositive ? "rgba(139, 195, 74, 0.1)" : "rgba(244, 67, 54, 0.1)"}
              stroke="none"
            />
            
            {selectedPoint && (
              <ReferenceLine
                x={selectedPoint.date}
                stroke="#D4AF37"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockLineChart;
