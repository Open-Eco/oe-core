# EcoKit Charts - Usage Examples

EcoKit provides chart components built on Recharts, fully themed with EcoKit design tokens.

## Installation

```bash
npm install recharts
```

## Basic Line Chart

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
    { dataKey: 'emissions', name: 'Emissions (tons)', color: '#1A6F8A' }
  ]}
/>
```

## Multi-Series Line Chart

```tsx
const data = [
  { year: '2020', scope1: 1000, scope2: 500, scope3: 2000 },
  { year: '2021', scope1: 800, scope2: 450, scope3: 1800 },
  { year: '2022', scope1: 600, scope2: 400, scope3: 1500 },
];

<EcoLineChart
  title="Emissions by Scope"
  data={data}
  dataKey="year"
  lines={[
    { dataKey: 'scope1', name: 'Scope 1' },
    { dataKey: 'scope2', name: 'Scope 2' },
    { dataKey: 'scope3', name: 'Scope 3' }
  ]}
  height="large"
/>
```

## Area Chart

```tsx
import { EcoAreaChart } from '@/assets/EcoKit/components/charts';

<EcoAreaChart
  title="Energy Consumption"
  data={energyData}
  dataKey="date"
  areas={[
    { dataKey: 'renewable', name: 'Renewable Energy' },
    { dataKey: 'fossil', name: 'Fossil Fuels' }
  ]}
/>
```

## Bar Chart

```tsx
import { EcoBarChart } from '@/assets/EcoKit/components/charts';

<EcoBarChart
  title="Emissions by Category"
  data={categoryData}
  dataKey="category"
  bars={[
    { dataKey: 'value', name: 'Emissions' }
  ]}
/>
```

## Horizontal Bar Chart

```tsx
<EcoBarChart
  title="Top Emitters"
  data={emitterData}
  dataKey="company"
  bars={[
    { dataKey: 'emissions', name: 'CO2 (tons)' }
  ]}
  layout="horizontal"
/>
```

## Pie Chart

```tsx
import { EcoPieChart } from '@/assets/EcoKit/components/charts';

const pieData = [
  { name: 'Renewable', value: 60 },
  { name: 'Coal', value: 25 },
  { name: 'Gas', value: 15 },
];

<EcoPieChart
  title="Energy Mix"
  data={pieData}
  dataKey="value"
  nameKey="name"
/>
```

## Custom Colors

```tsx
import { ECOKIT_COLORS } from '@/assets/EcoKit/components/charts';

<EcoLineChart
  data={data}
  dataKey="month"
  lines={[
    { 
      dataKey: 'emissions', 
      name: 'Emissions',
      color: ECOKIT_COLORS.error  // Use error color for emissions
    }
  ]}
/>
```

## Chart Heights

```tsx
// Predefined heights
<EcoLineChart height="compact" />  // 200px
<EcoLineChart height="standard" /> // 300px
<EcoLineChart height="large" />    // 400px
<EcoLineChart height="tall" />     // 500px

// Custom height
<EcoLineChart height={600} />
```

## Customization

All charts use EcoKit CSS variables, so they automatically adapt to your theme:

- Colors: `--brand-blue-600`, `--brand-green-600`, etc.
- Typography: `--font-sans`, `--text-sm`, etc.
- Spacing: `--space-4`, `--space-8`, etc.
- Shadows: `--shadow-lg`
- Radius: `--radius-md`

## Accessibility

Charts include:
- ARIA labels
- Keyboard navigation support
- Screen reader friendly tooltips
- High contrast color options

