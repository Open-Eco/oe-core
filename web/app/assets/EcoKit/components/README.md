# EcoKit Chart Components

EcoKit chart components are built on [Recharts](https://recharts.org/) and fully themed with EcoKit design tokens.

## Installation

```bash
npm install recharts
```

## Components

- **EcoLineChart** - Line charts for trends over time
- **EcoAreaChart** - Area charts for cumulative data visualization
- **EcoBarChart** - Vertical and horizontal bar charts
- **EcoPieChart** - Pie and donut charts for proportional data

## Features

- ✅ Fully themed with EcoKit design tokens (colors, typography, spacing)
- ✅ Responsive and accessible
- ✅ Customizable colors and styling
- ✅ Multiple height presets
- ✅ Built-in tooltips and legends
- ✅ TypeScript support

## Quick Start

```tsx
import { EcoLineChart } from '@/assets/EcoKit/components/charts';

const data = [
  { month: 'Jan', emissions: 4000 },
  { month: 'Feb', emissions: 3000 },
  { month: 'Mar', emissions: 2000 },
];

<EcoLineChart
  title="Monthly Emissions"
  subtitle="CO2 emissions over time"
  data={data}
  dataKey="month"
  lines={[
    { dataKey: 'emissions', name: 'Emissions (tons)' }
  ]}
/>
```

See [charts-examples.md](./charts-examples.md) for detailed examples and usage patterns.

