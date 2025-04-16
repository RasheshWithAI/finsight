
import { useState, useCallback } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Bar,
} from "recharts";
import { Button } from "@/components/ui/button";
import { ChartBarIcon, TrendingUpIcon, ChartCandlestick } from "lucide-react";

// Generate sample data with OHLC values
const generateMockData = (days: number, volatility: number = 0.02) => {
  const data = [];
  let price = 150;
  let high, low, open, close;
  const baseDate = new Date(2024, 3, 7); // April 7, 2024
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() - i);
    
    // Generate OHLC data
    open = price;
    high = price * (1 + Math.random() * volatility);
    low = price * (1 - Math.random() * volatility);
    
    // 50% chance of up or down day
    const isUpDay = Math.random() > 0.5;
    if (isUpDay) {
      close = low + Math.random() * (high - low);
      price = close;
    } else {
      close = low + Math.random() * (high - low);
      price = close;
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      price: Number(close.toFixed(2)), // Maintain compatibility with previous data format
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

// Custom component to render candlestick
const CandlestickBar = (props: any) => {
  const { x, y, width, height, open, close } = props;
  const isPositive = close >= open;
  const color = isPositive ? "#8BC34A" : "#F44336";
  const barWidth = Math.max(1, width * 0.5); // Make sure bar has at least 1px width
  const barX = x - barWidth / 2;
  
  return (
    <g>
      {/* Wick (high to low) */}
      <line
        x1={x}
        y1={y}
        x2={x}
        y2={y + height}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body (open to close) */}
      <rect
        x={barX}
        y={isPositive ? props.openY : props.closeY}
        width={barWidth}
        height={Math.abs(props.closeY - props.openY)}
        fill={color}
        stroke={color}
      />
    </g>
  );
};

const StockLineChart = ({ symbol = "AAPL", showOverlay = false, comparisonData }: StockLineChartProps) => {
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "6M" | "1Y">("1M");
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [chartType, setChartType] = useState<"candlestick" | "line">("candlestick");
  
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

  const latestPrice = chartData[chartData.length - 1].close;
  const startPrice = chartData[0].open;
  const priceChange = latestPrice - startPrice;
  const priceChangePercent = (priceChange / startPrice) * 100;
  
  const isPositive = priceChange >= 0;
  const domain = chartData.reduce(
    (acc: [number, number], item: any) => [
      Math.min(acc[0], item.low * 0.99),
      Math.max(acc[1], item.high * 1.01),
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

  // Custom tooltip for OHLC data
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-aura-dark-gray border border-gray-700 rounded-md shadow-lg">
          <p className="font-medium text-aura-primary-text">{label}</p>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <p className="text-aura-secondary-text">Open:</p>
            <p className="text-aura-gold text-right">${data.open.toFixed(2)}</p>
            
            <p className="text-aura-secondary-text">High:</p>
            <p className="text-aura-gold text-right">${data.high.toFixed(2)}</p>
            
            <p className="text-aura-secondary-text">Low:</p>
            <p className="text-aura-gold text-right">${data.low.toFixed(2)}</p>
            
            <p className="text-aura-secondary-text">Close:</p>
            <p className="text-aura-gold text-right">${data.close.toFixed(2)}</p>
          </div>
          <p className="text-xs text-aura-secondary-text mt-1">
            Volume: {parseInt(data.volume).toLocaleString()}
          </p>
          {payload.length > 1 && (
            <p className="text-aura-chart-blue text-lg font-bold mt-1">
              ${payload[1].value.toFixed(2)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Function to render candlesticks
  const renderCandlestick = (data: any[]) => {
    return data.map((entry, index) => {
      const { date, open, close, high, low } = entry;
      // Calculate positions
      const x = index; // X position scaled by recharts
      const openY = open; // Y position scaled by recharts
      const closeY = close; // Y position scaled by recharts
      const highY = high; // Y position scaled by recharts
      const lowY = low; // Y position scaled by recharts
      
      return (
        <CandlestickBar 
          key={`candle-${date}`} 
          x={x} 
          y={lowY} 
          height={highY - lowY} 
          width={0.8} 
          open={open} 
          close={close} 
          openY={openY}
          closeY={closeY}
          high={high}
          low={low}
        />
      );
    });
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
            variant="outline" 
            size="icon"
            onClick={() => setChartType(chartType === "candlestick" ? "line" : "candlestick")}
            title={chartType === "candlestick" ? "Switch to line chart" : "Switch to candlestick chart"}
            className="mr-2"
          >
            {chartType === "candlestick" ? (
              <TrendingUpIcon className="h-4 w-4" />
            ) : (
              <ChartBarIcon className="h-4 w-4" />
            )}
          </Button>
          
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
          <ComposedChart
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
            
            {chartType === "line" ? (
              <>
                {/* Line chart */}
                <Line
                  type="monotone"
                  dataKey="close"
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
                    dataKey="close"
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
              </>
            ) : (
              <>
                {/* Candlestick chart */}
                {/* We use a Bar component with custom rendering for candlesticks */}
                <Bar
                  dataKey="high"
                  fill="transparent"
                  stroke="transparent"
                  barSize={8}
                  shape={(props) => {
                    const { x, y, width, height, payload } = props;
                    const isPositive = payload.close >= payload.open;
                    const color = isPositive ? "#8BC34A" : "#F44336";
                    
                    return (
                      <g>
                        {/* Wick (high to low) */}
                        <line
                          x1={x + width / 2}
                          y1={y}
                          x2={x + width / 2}
                          y2={y + height}
                          stroke={color}
                        />
                        {/* Body (open to close) */}
                        <rect
                          x={x}
                          y={isPositive ? props.y + (1 - (payload.close - payload.low) / (payload.high - payload.low)) * height : 
                                          props.y + (1 - (payload.open - payload.low) / (payload.high - payload.low)) * height}
                          width={width}
                          height={Math.abs(
                            (props.y + (1 - (payload.close - payload.low) / (payload.high - payload.low)) * height) -
                            (props.y + (1 - (payload.open - payload.low) / (payload.high - payload.low)) * height)
                          ) || 1} // Ensure at least 1px height
                          fill={color}
                        />
                      </g>
                    );
                  }}
                />
              </>
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
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockLineChart;
