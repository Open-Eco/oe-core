/**
 * EcoKit Chart Components
 * Recharts-based chart components themed with EcoKit design tokens
 */

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// EcoKit color palette for charts
const ECOKIT_COLORS = {
  primary: '#1A6F8A',      // --brand-blue-600
  secondary: '#138A4F',    // --brand-green-600
  success: '#0F9D58',      // --success-500
  warning: '#F4B400',      // --warning-500
  error: '#DB4437',        // --error-500
  neutral: '#7A8C8E',      // --neutral-500
  gradient: ['#1A6F8A', '#138A4F'], // Brand gradient
};

// Default color sequence for multi-series charts
const DEFAULT_COLORS = [
  ECOKIT_COLORS.primary,
  ECOKIT_COLORS.secondary,
  ECOKIT_COLORS.success,
  ECOKIT_COLORS.warning,
  ECOKIT_COLORS.error,
  ECOKIT_COLORS.neutral,
];

interface ChartProps {
  title?: string;
  subtitle?: string;
  height?: 'compact' | 'standard' | 'large' | 'tall' | number;
  data: any[];
  className?: string;
}

interface BaseChartProps extends ChartProps {
  children: React.ReactNode;
}

/**
 * Base chart wrapper with EcoKit theming
 */
export const EcoChart: React.FC<BaseChartProps> = ({
  title,
  subtitle,
  height = 'standard',
  data,
  children,
  className = '',
}) => {
  const heightClass = typeof height === 'string' ? `eco-chart--${height}` : '';
  const heightValue = typeof height === 'number' ? height : undefined;

  return (
    <div className={`eco-chart ${heightClass} ${className}`}>
      {title && <h3 className="eco-chart__title">{title}</h3>}
      {subtitle && <p className="eco-chart__subtitle">{subtitle}</p>}
      <div className="eco-chart__container" style={heightValue ? { height: `${heightValue}px` } : undefined}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/**
 * Line Chart Component
 */
interface LineChartProps extends ChartProps {
  dataKey: string;
  lines: Array<{
    dataKey: string;
    name: string;
    color?: string;
    strokeWidth?: number;
  }>;
  showGrid?: boolean;
  showLegend?: boolean;
}

export const EcoLineChart: React.FC<LineChartProps> = ({
  dataKey,
  lines,
  showGrid = true,
  showLegend = true,
  ...chartProps
}) => {
  return (
    <EcoChart {...chartProps} className="eco-chart--line">
      <LineChart data={chartProps.data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="eco-chart__grid" />}
        <XAxis dataKey={dataKey} className="eco-chart__axis" />
        <YAxis className="eco-chart__axis" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid var(--neutral-300)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
          }}
        />
        {showLegend && <Legend />}
        {lines.map((line, index) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            strokeWidth={line.strokeWidth || 2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </EcoChart>
  );
};

/**
 * Area Chart Component
 */
interface AreaChartProps extends ChartProps {
  dataKey: string;
  areas: Array<{
    dataKey: string;
    name: string;
    color?: string;
  }>;
  showGrid?: boolean;
  showLegend?: boolean;
}

export const EcoAreaChart: React.FC<AreaChartProps> = ({
  dataKey,
  areas,
  showGrid = true,
  showLegend = true,
  ...chartProps
}) => {
  return (
    <EcoChart {...chartProps} className="eco-chart--area">
      <AreaChart data={chartProps.data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="eco-chart__grid" />}
        <XAxis dataKey={dataKey} className="eco-chart__axis" />
        <YAxis className="eco-chart__axis" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid var(--neutral-300)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
          }}
        />
        {showLegend && <Legend />}
        {areas.map((area, index) => (
          <Area
            key={area.dataKey}
            type="monotone"
            dataKey={area.dataKey}
            name={area.name}
            stroke={area.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            fill={area.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            fillOpacity={0.6}
          />
        ))}
      </AreaChart>
    </EcoChart>
  );
};

/**
 * Bar Chart Component
 */
interface BarChartProps extends ChartProps {
  dataKey: string;
  bars: Array<{
    dataKey: string;
    name: string;
    color?: string;
  }>;
  showGrid?: boolean;
  showLegend?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export const EcoBarChart: React.FC<BarChartProps> = ({
  dataKey,
  bars,
  showGrid = true,
  showLegend = true,
  layout = 'vertical',
  ...chartProps
}) => {
  return (
    <EcoChart {...chartProps} className="eco-chart--bar">
      <BarChart data={chartProps.data} layout={layout}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="eco-chart__grid" />}
        <XAxis dataKey={layout === 'vertical' ? dataKey : undefined} className="eco-chart__axis" />
        <YAxis dataKey={layout === 'horizontal' ? dataKey : undefined} className="eco-chart__axis" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid var(--neutral-300)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
          }}
        />
        {showLegend && <Legend />}
        {bars.map((bar, index) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </EcoChart>
  );
};

/**
 * Pie Chart Component
 */
interface PieChartProps extends ChartProps {
  dataKey: string;
  nameKey: string;
  colors?: string[];
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

export const EcoPieChart: React.FC<PieChartProps> = ({
  dataKey,
  nameKey,
  colors = DEFAULT_COLORS,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 80,
  ...chartProps
}) => {
  return (
    <EcoChart {...chartProps}>
      <PieChart>
        <Pie
          data={chartProps.data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {chartProps.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid var(--neutral-300)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
          }}
        />
        {showLegend && <Legend />}
      </PieChart>
    </EcoChart>
  );
};

// Export color constants for custom use
export { ECOKIT_COLORS, DEFAULT_COLORS };

