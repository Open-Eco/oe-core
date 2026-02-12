# Reporting Module

This module provides data collection functionality for generating sustainability reports based on emissions and activity data.

## Overview

The Reporting module is designed to gather and aggregate data needed for compliance reporting (TCFD, CSRD, CDP, GRI, etc.). It provides a structured way to collect emissions data, activity data, and organization profiles with comprehensive validation and error handling.

## Architecture

```
web/lib/reporting/
├── types.ts                 # Type definitions
├── index.ts                 # Module exports
├── examples.ts              # Usage examples
└── collectors/
    ├── index.ts
    └── ReportDataCollector.ts  # Main data collector
```

## Usage

### Basic Example

```typescript
import { ReportDataCollector } from "@/lib/reporting"

const collector = new ReportDataCollector()

// Collect emissions data
const emissionsResult = await collector.collectEmissions(
  "org_123",
  new Date("2024-01-01"),
  new Date("2024-12-31")
)

if (emissionsResult.success) {
  const { totalCo2e, byScope, byCategory } = emissionsResult.data!
  console.log(`Total emissions: ${totalCo2e} tCO2e`)
}
```

## ReportDataCollector

The main class for collecting report data.

### Methods

#### `collectEmissions(organizationId, periodStart, periodEnd)`

Collects and aggregates emissions data for an organization within a specified period.

**Parameters:**
- `organizationId` (string): The organization ID
- `periodStart` (Date): Start date of the reporting period
- `periodEnd` (Date): End date of the reporting period

**Returns:** `Promise<CollectionResult<AggregatedEmissions>>`

**Validation:**
- Organization ID must be a non-empty string
- Period start and end must be valid dates
- Period end must be after period start
- Organization must exist in the database
- At least one emission record must exist for the period

**Output:**
```typescript
{
  success: true,
  data: {
    totalCo2e: 1234.56,
    byScope: {
      "1": 500,
      "2": 400,
      "3": 334.56
    },
    byCategory: {
      "stationary_combustion": 500,
      "electricity": 400,
      "business_travel": 334.56
    },
    data: [/* individual emission records */]
  }
}
```

#### `collectActivityData(organizationId, periodStart, periodEnd)`

Collects activity data with evidence status for an organization within a period.

**Parameters:**
- `organizationId` (string): The organization ID
- `periodStart` (Date): Start date of the reporting period
- `periodEnd` (Date): End date of the reporting period

**Returns:** `Promise<CollectionResult<ActivityDataItem[]>>`

**Validation:**
- Same validation rules as `collectEmissions`
- At least one activity record must exist for the period

**Output:**
```typescript
{
  success: true,
  data: [
    {
      id: "activity_123",
      category: "Scope 2",
      activityType: "electricity",
      quantity: 1000,
      unit: "kWh",
      periodStart: Date,
      periodEnd: Date,
      status: "approved",
      source: "manual",
      hasEvidence: true
    },
    // ... more records
  ]
}
```

#### `collectOrganizationProfile(organizationId)`

Collects organization profile including boundaries, facilities, and metadata.

**Parameters:**
- `organizationId` (string): The organization ID

**Returns:** `Promise<CollectionResult<OrganizationProfile>>`

**Validation:**
- Organization ID must be a non-empty string
- Organization must exist in the database

**Output:**
```typescript
{
  success: true,
  data: {
    id: "org_123",
    name: "Acme Corporation",
    slug: "acme-corp",
    verified: true,
    facilitiesCount: 3,
    boundaries: {
      operational: ["Facility A", "Facility B", "Facility C"],
      organizational: ["Acme Corporation"]
    },
    metadata: {
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-12-31T23:59:59.999Z"
    }
  }
}
```

## Error Handling

All collector methods return a `CollectionResult<T>` type that includes success status and errors:

```typescript
interface CollectionResult<T> {
  success: boolean
  data?: T
  errors?: CollectionError[]
}

interface CollectionError {
  field: string      // Which field caused the error
  message: string    // Human-readable error message
  code: string       // Error code for programmatic handling
}
```

### Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `NOT_FOUND` - Organization not found
- `NO_DATA` - No data found for the specified period
- `DATABASE_ERROR` - Database query failed

### Error Handling Example

```typescript
const result = await collector.collectEmissions(orgId, start, end)

if (!result.success) {
  result.errors?.forEach(error => {
    console.error(`Error in ${error.field}: ${error.message} (${error.code})`)
  })
  return
}

// Use result.data safely
const emissions = result.data!
```

## Type Definitions

### AggregatedEmissions

```typescript
interface AggregatedEmissions {
  totalCo2e: number
  byScope: Record<string, number>
  byCategory: Record<string, number>
  data: EmissionData[]
}
```

### ActivityDataItem

```typescript
interface ActivityDataItem {
  id: string
  category: string
  subcategory?: string
  activityType: string
  quantity: number
  unit: string
  periodStart: Date
  periodEnd: Date
  status: string
  source?: string
  hasEvidence: boolean
}
```

### OrganizationProfile

```typescript
interface OrganizationProfile {
  id: string
  name: string
  slug: string
  domain?: string
  verified: boolean
  facilitiesCount: number
  boundaries?: {
    operational: string[]
    organizational: string[]
  }
  metadata?: Record<string, any>
}
```

## Integration with Reporting Engine

This collector is the first layer in the reporting engine pipeline:

1. **Data Collection** (this module) - Gather raw data from database
2. **Framework Mapping** - Map data to framework-specific disclosures (TCFD, CSRD, etc.)
3. **Template Rendering** - Generate HTML/PDF reports
4. **Verification** - Add content hashing and verification codes

See `Reporting_enginer.md` in the project root for the complete architecture.

## Future Enhancements

- Add `collectMethodology()` method for calculation metadata
- Support for filtering by facility
- Caching layer for frequently accessed data
- Streaming support for large datasets
- Export to CSV/JSON formats
